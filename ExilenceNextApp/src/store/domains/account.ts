import { action, computed, observable, runInAction } from 'mobx';
import { persist } from 'mobx-persist';
import { fromStream } from 'mobx-utils';
import { of, throwError, Subject, interval, timer } from 'rxjs';
import {
  catchError,
  delay,
  mergeMap,
  retryWhen,
  take,
  map,
  switchMap,
  takeUntil
} from 'rxjs/operators';
import uuid from 'uuid';
import { IAccount } from '../../interfaces/account.interface';
import { IApiProfile } from '../../interfaces/api/api-profile.interface';
import { ICharacter } from '../../interfaces/character.interface';
import { authService } from '../../services/auth.service';
import { ProfileUtils } from '../../utils/profile.utils';
import { stores, visitor } from './../../index';
import { IProfile } from './../../interfaces/profile.interface';
import { AccountLeague } from './account-league';
import { Profile } from './profile';
import { genericRetryStrategy } from '../../utils/rxjs.utils';
import { AxiosError } from 'axios';
import { IApiAccount } from '../../interfaces/api/api-account.interface';

export class Account implements IAccount {
  @persist uuid: string = uuid.v4();
  @persist name: string | undefined = undefined;
  @persist @observable sessionId: string = '';

  @persist('list', AccountLeague)
  @observable
  accountLeagues: AccountLeague[] = [];
  @persist('list', Profile) @observable profiles: Profile[] = [
    new Profile({ name: 'profile 1' })
  ];

  cancelled: Subject<boolean> = new Subject();

  constructor(obj?: IAccount) {
    Object.assign(this, obj);
  }

  @computed
  get activeLeague() {
    const profile = this.activeProfile;
    if (profile) {
      return stores.leagueStore.leagues.find(
        l => l.id === profile.activeLeagueId
      );
    } else {
      return undefined;
    }
  }

  @computed
  get activePriceLeague() {
    const profile = this.activeProfile;
    if (profile) {
      return stores.leagueStore.priceLeagues.find(
        l => l.id === profile.activePriceLeagueId
      );
    } else {
      return undefined;
    }
  }

  @action
  queueSnapshot() {
    fromStream(
      timer(stores.settingStore.autoSnapshotInterval).pipe(
        map(() => {
          if (this.activeProfile && this.activeProfile.readyToSnapshot) {
            this.activeProfile.snapshot();
          }
        }),
        takeUntil(this.cancelled)
      )
    );
  }

  @action
  dequeueSnapshot() {
    this.cancelled.next(true);
  }

  @action
  updateAccountFromApi(account: IApiAccount) {
    this.uuid = account.uuid;
    stores.accountStore.setActiveAccount(this.uuid);
  }

  @action
  updateProfiles(profiles: IApiProfile[]) {
    const mappedProfiles = profiles.map(p => {
      const currentProfile = this.profiles.find(cp => cp.uuid === p.uuid);
      const newProfile = new Profile(p);
      if (currentProfile) {
        newProfile.snapshots = currentProfile.snapshots;
      }
      return newProfile;
    });
    // if no active profile, set first profile in array to active
    const activeProfile = profiles.find(p => p.active);
    if (!activeProfile && profiles.length > 0) {
      profiles[0].active = true;
    }
    this.profiles = mappedProfiles;
  }

  @action
  getProfilesForAccount(accountUuid: string) {
    return stores.signalrStore.signalrHub
      .invokeEvent<string>('GetAllProfiles', accountUuid)
      .pipe(
        map((profiles: IApiProfile[]) => {
          this.getProfilesForAccountSuccess();
          return profiles;
        }),
        retryWhen(
          genericRetryStrategy({
            maxRetryAttempts: 5,
            scalingDuration: 5000
          })
        ),
        catchError((e: Error) => {
          this.getProfilesForAccountFail(e);
          return throwError(e);
        })
      );
  }

  @action
  getProfilesForAccountSuccess() {
    stores.notificationStore.createNotification(
      'get_profiles_for_account',
      'success'
    );
  }

  @action
  getProfilesForAccountFail(e: AxiosError | Error) {
    stores.notificationStore.createNotification(
      'get_profiles_for_account',
      'error',
      true,
      e
    );
  }

  @action
  authorize() {
    return authService
      .getToken({
        uuid: this.uuid,
        name: this.name!,
        accessToken: stores.accountStore.token!.accessToken,
        profiles: []
      })
      .pipe(
        mergeMap(account => {
          this.updateAccountFromApi(account.data);
          return !stores.signalrHub.connection
            ? stores.signalrStore.signalrHub.startConnection(
                account.data.accessToken
              )
            : of({});
        }),
        switchMap(() => {
          return this.getProfilesForAccount(this.uuid).pipe(
            map((profiles: IApiProfile[]) => {
              this.updateProfiles(profiles);
              if (this.profiles.length > 0) {
                stores.uiStateStore.setProfilesLoaded(true);
              }
            })
          );
        }),
        switchMap(() => {
          return of(this.authorizeSuccess());
        }),
        catchError(e => {
          this.authorizeFail(e);
          return throwError(e);
        })
      );
  }

  @action
  authorizeSuccess() {
    stores.notificationStore.createNotification('authorize', 'success');
  }

  @action
  authorizeFail(e: Error) {
    stores.notificationStore.createNotification('authorize', 'error', true, e);
  }

  @computed
  get activeProfile() {
    let active = this.profiles.find(p => p.active);
    return active;
  }

  @action
  setActiveProfile(uuid: string) {
    stores.uiStateStore.setChangingProfile(true);
    stores.uiStateStore.changeItemTablePage(0);

    fromStream(this.setActiveProfileObservable(uuid));
  }

  @action
  setActiveProfileObservable(uuid: string) {
    return stores.signalrHub.invokeEvent<string>('ChangeProfile', uuid).pipe(
      map((uuid: string) => {
        runInAction(() => {
          this.profiles = this.profiles.map(p => {
            p.active = false;
            return p;
          });
        });
        const foundProfile = this.profiles.find(p => p.uuid === uuid);
        if (!foundProfile) {
          return throwError('error:no_profile_found');
        }
        runInAction(() => {
          foundProfile.active = true;
        });
        if (stores.signalrStore.activeGroup) {
          stores.signalrStore.changeProfileForConnection(
            stores.signalrStore.ownConnection.connectionId,
            ProfileUtils.mapProfileToApiProfile(foundProfile)
          );
        }
        return this.setActiveProfileSuccess();
      }),
      retryWhen(
        genericRetryStrategy({
          maxRetryAttempts: 5,
          scalingDuration: 5000
        })
      ),
      catchError((e: AxiosError) => of(this.setActiveProfileFail(e)))
    );
  }

  @action
  updateAccountLeagues(characters: ICharacter[]) {
    stores.leagueStore.leagues.forEach(l => {
      let accLeague = this.accountLeagues.find(al => al.leagueId === l.id);
      const leagueCharacters = characters.filter(c => c.league === l.id);

      if (accLeague) {
        accLeague.updateCharacters(leagueCharacters);
      }

      if (!accLeague && leagueCharacters) {
        accLeague = new AccountLeague(l.id);
        accLeague.updateCharacters(leagueCharacters);
        this.accountLeagues.push(accLeague);
      }
    });
  }

  @action
  removeActiveProfile() {
    stores.uiStateStore.setRemovingProfile(true);
    visitor!.event('Profile', 'Remove profile').send();

    const profileIndex = this.profiles.findIndex(p => p.active);
    const newActiveProfile = this.profiles.find(p => !p.active);

    if (profileIndex === -1) {
      this.removeActiveProfileFail(new Error('profile_not_found'));
    }

    fromStream(
      this.setActiveProfileObservable(newActiveProfile!.uuid).pipe(
        switchMap(() => {
          return stores.signalrHub.invokeEvent<string>(
            'RemoveProfile',
            this.profiles[profileIndex].uuid
          );
        }),
        map((uuid: string) => {
          this.deleteProfiles(profileIndex, 1);
          stores.uiStateStore.setConfirmRemoveProfileDialogOpen(false);
          return this.removeActiveProfileSuccess();
        }),
        retryWhen(
          genericRetryStrategy({
            maxRetryAttempts: 5,
            scalingDuration: 5000
          })
        ),
        catchError((e: AxiosError) => of(this.removeActiveProfileFail(e)))
      )
    );
  }

  @action
  deleteProfiles(index: number, amount: number) {
    this.profiles.splice(index, amount);
  }

  @action
  removeActiveProfileSuccess() {
    stores.uiStateStore.setRemovingProfile(false);
    stores.notificationStore.createNotification('remove_profile', 'success');
  }

  @action
  removeActiveProfileFail(e: Error) {
    stores.uiStateStore.setRemovingProfile(false);
    stores.notificationStore.createNotification(
      'remove_profile',
      'error',
      true,
      e
    );
  }

  @action
  setActiveProfileSuccess() {
    stores.notificationStore.createNotification(
      'set_active_profile',
      'success'
    );
    stores.uiStateStore.setChangingProfile(false);
  }

  @action
  setActiveProfileFail(e: Error) {
    stores.notificationStore.createNotification(
      'set_active_profile',
      'error',
      true,
      e
    );
    stores.uiStateStore.setChangingProfile(false);
  }

  @action
  setSessionId(sessionId: string) {
    this.sessionId = sessionId;
  }

  @action
  createProfile(profile: IProfile, callback: () => void) {
    fromStream(this.createProfileObservable(profile, callback));
  }

  @action
  createProfileObservable(profile: IProfile, callback: () => void) {
    stores.uiStateStore.setSavingProfile(true);
    const newProfile = new Profile(profile);

    newProfile.active = true;

    const apiProfile = ProfileUtils.mapProfileToApiProfile(newProfile);

    return stores.signalrHub
      .invokeEvent<IApiProfile>('AddProfile', apiProfile)
      .pipe(
        map((p: IApiProfile) => {
          this.addProfile(newProfile);
          this.setActiveProfile(newProfile.uuid);
          callback();
          this.createProfileSuccess();
          return p;
        }),
        retryWhen(
          genericRetryStrategy({
            maxRetryAttempts: 5,
            scalingDuration: 5000
          })
        ),
        catchError((e: AxiosError) => of(this.createProfileFail(e)))
      );
  }

  @action
  createProfileFail(e: Error) {
    stores.uiStateStore.setSavingProfile(false);
    stores.notificationStore.createNotification(
      'create_profile',
      'error',
      false,
      e
    );
  }

  @action
  createProfileSuccess() {
    stores.uiStateStore.setSavingProfile(false);
    stores.notificationStore.createNotification('create_profile', 'success');
  }

  @action
  addProfile(p: Profile) {
    this.profiles.push(p);
    if (stores.signalrStore.activeGroup) {
      stores.signalrStore.addProfileToConnection(
        stores.signalrStore.ownConnection.connectionId,
        ProfileUtils.mapProfileToApiProfile(p)
      );
    }
  }
}

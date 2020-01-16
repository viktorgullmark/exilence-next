import { action, computed, observable, runInAction } from 'mobx';
import { persist } from 'mobx-persist';
import { fromStream } from 'mobx-utils';
import { of, throwError } from 'rxjs';
import {
  catchError,
  delay,
  mergeMap,
  retryWhen,
  take,
  map,
  switchMap
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
  @persist('list', Profile) @observable profiles: Profile[] = [];

  constructor(obj?: IAccount) {
    Object.assign(this, obj);
  }

  @computed
  get activeLeague() {
    const league = stores.leagueStore.leagues.find(
      l => l.id === this.activeProfile.activeLeagueId
    );
    return league;
  }

  @computed
  get activePriceLeague() {
    const league = stores.leagueStore.priceLeagues.find(
      l => l.id === this.activeProfile.activePriceLeagueId
    );
    return league!;
  }

  @action
  updateAccountFromApi(account: IApiAccount) {
    this.uuid = account.uuid;
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
          this.authorizeSuccess();
          this.updateAccountFromApi(account.data);
          return stores.signalrStore.signalrHub.startConnection(
            account.data.accessToken
          );
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
        retryWhen(
          genericRetryStrategy({
            maxRetryAttempts: 3,
            scalingDuration: 3000
          })
        ),
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
    const profile = this.profiles.find(p => p.active);
    return profile ? profile : new Profile();
  }

  @action
  setActiveProfile(uuid: string) {
    stores.uiStateStore.changeItemTablePage(0);

    fromStream(
      stores.signalrHub.invokeEvent<string>('ChangeProfile', uuid).pipe(
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
          return this.setActiveProfileSuccess();
        }),
        catchError((e: AxiosError) => of(this.setActiveProfileFail(e)))
      )
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

    fromStream(
      stores.signalrHub
        .invokeEvent<string>('RemoveProfile', this.profiles[profileIndex].uuid)
        .pipe(
          map((uuid: string) => {
            if (profileIndex === -1) {
              this.removeActiveProfileFail(new Error('profile_not_found'));
            } else {
              const newActiveProfile = this.profiles.find(p => !p.active);
              this.deleteProfiles(profileIndex, 1);
              this.setActiveProfile(newActiveProfile!.uuid);
            }
            stores.uiStateStore.setConfirmRemoveProfileDialogOpen(false);
            return this.removeActiveProfileSuccess();
          }),
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
  }

  @action
  setActiveProfileFail(e: Error) {
    stores.notificationStore.createNotification(
      'set_active_profile',
      'error',
      true,
      e
    );
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

    return stores.signalrHub
      .invokeEvent<IApiProfile>(
        'AddProfile',
        ProfileUtils.mapProfileToApiProfile(newProfile)
      )
      .pipe(
        map((p: IApiProfile) => {
          this.addProfile(newProfile);
          this.setActiveProfile(newProfile.uuid);
          callback();
          this.createProfileSuccess();
          return p;
        }),
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
  }
}

import { AxiosError } from 'axios';
import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { persist } from 'mobx-persist';
import { fromStream } from 'mobx-utils';
import { of, Subject, throwError, timer } from 'rxjs';
import { catchError, map, mergeMap, retryWhen, switchMap, takeUntil } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { IAccount } from '../../interfaces/account.interface';
import { IApiAccount } from '../../interfaces/api/api-account.interface';
import { IApiProfile } from '../../interfaces/api/api-profile.interface';
import { ICharacter } from '../../interfaces/character.interface';
import { authService } from '../../services/auth.service';
import { mapProfileToApiProfile } from '../../utils/profile.utils';
import { genericRetryStrategy } from '../../utils/rxjs.utils';
import { rootStore, visitor } from './../../index';
import { IProfile } from './../../interfaces/profile.interface';
import { AccountLeague } from './account-league';
import { Profile } from './profile';

export class Account implements IAccount {
  @persist uuid: string = uuidv4();
  @persist name: string | undefined = undefined;
  @persist @observable sessionId: string = '';

  @persist('list', AccountLeague)
  @observable
  accountLeagues: AccountLeague[] = [];
  @persist('list', Profile) @observable profiles: Profile[] = [new Profile({ name: 'profile 1' })];

  cancelled: Subject<boolean> = new Subject();

  constructor(obj?: IAccount) {
    makeObservable(this);
    Object.assign(this, obj);
  }

  @computed
  get stashTabColors() {
    const profile = this.activeProfile;
    if (profile) {
      const league = rootStore.leagueStore.leagues.find((l) => l.id === profile.activeLeagueId);
      const accountLeague = this.accountLeagues.find((l) => l.leagueId === league?.id);
      return accountLeague?.stashtabs
        .filter((s) => this.activeProfile?.activeStashTabIds.includes(s.id))
        .map((s) => s.metadata.colour);
    } else {
      return undefined;
    }
  }

  @computed
  get activeLeague() {
    const profile = this.activeProfile;
    if (profile) {
      return rootStore.leagueStore.leagues.find((l) => l.id === profile.activeLeagueId);
    } else {
      return undefined;
    }
  }

  @computed
  get activeCharacter() {
    const profile = this.activeProfile;
    const accountLeague = this.accountLeagues.find((l) => l.leagueId === profile?.activeLeagueId);
    return accountLeague?.characters?.find((ac) => ac.name === profile?.activeCharacterName);
  }

  get characters() {
    const profile = this.activeProfile;
    if (profile) {
      return this.accountLeagues.find((l) => l.leagueId === profile.activeLeagueId)?.characters;
    } else {
      return undefined;
    }
  }

  @computed
  get activePriceLeague() {
    const profile = this.activeProfile;
    if (profile) {
      return rootStore.leagueStore.priceLeagues.find((l) => l.id === profile.activePriceLeagueId);
    } else {
      return undefined;
    }
  }

  @action
  queueSnapshot(milliseconds?: number) {
    fromStream(
      timer(milliseconds ? milliseconds : rootStore.settingStore.autoSnapshotInterval).pipe(
        map(() => {
          if (this.activeProfile && this.activeProfile.readyToSnapshot) {
            this.activeProfile.snapshot();
          } else {
            this.dequeueSnapshot();
            this.queueSnapshot(10 * 1000);
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
    rootStore.accountStore.setActiveAccount(this.uuid);
  }

  @action
  updateLeaguesForProfiles(leagues: string[]) {
    this.profiles = this.profiles.map((p) => {
      if (!leagues.find((l) => l === p.activeLeagueId)) {
        p.activeLeagueId = 'Standard';
      }
      if (!leagues.find((l) => l === p.activePriceLeagueId)) {
        p.activePriceLeagueId = 'Standard';
      }
      return p;
    });
  }

  @action
  updateProfiles(profiles: IApiProfile[]) {
    const mappedProfiles = profiles.map((p) => {
      const currentProfile = this.profiles.find((cp) => cp.uuid === p.uuid);
      const newProfile = new Profile(p);
      if (currentProfile) {
        newProfile.snapshots = currentProfile.snapshots;
      }
      return newProfile;
    });
    // if no active profile, set first profile in array to active
    const activeProfile = profiles.find((p) => p.active);
    if (!activeProfile && profiles.length > 0) {
      profiles[0].active = true;
    }
    this.profiles = mappedProfiles;
  }

  @action
  getProfilesForAccount(accountUuid: string) {
    return rootStore.signalrHub.invokeEvent<string>('GetAllProfiles', accountUuid).pipe(
      map((profiles: IApiProfile[]) => {
        this.getProfilesForAccountSuccess();
        return profiles;
      }),
      retryWhen(
        genericRetryStrategy({
          maxRetryAttempts: 5,
          scalingDuration: 5000,
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
    rootStore.notificationStore.createNotification('get_profiles_for_account', 'success');
  }

  @action
  getProfilesForAccountFail(e: AxiosError | Error) {
    rootStore.notificationStore.createNotification('get_profiles_for_account', 'error', true, e);
  }

  @action
  authorize() {
    return authService
      .getToken({
        uuid: this.uuid,
        name: this.name!,
        accessToken: rootStore.accountStore.token!.accessToken,
        profiles: [],
      })
      .pipe(
        mergeMap((account) => {
          this.updateAccountFromApi(account.data);
          return !rootStore.signalrHub.connection
            ? rootStore.signalrHub.startConnection(account.data.accessToken)
            : of({});
        }),
        mergeMap(() => {
          return this.getProfilesForAccount(this.name!).pipe(
            map((profiles: IApiProfile[]) => {
              this.updateProfiles(profiles);
              if (this.profiles.length > 0) {
                rootStore.uiStateStore.setProfilesLoaded(true);
              }
            })
          );
        }),
        switchMap(() => {
          return of(this.authorizeSuccess());
        }),
        catchError((e) => {
          this.authorizeFail(e);
          return throwError(e);
        })
      );
  }

  @action
  authorizeSuccess() {
    rootStore.notificationStore.createNotification('authorize', 'success');
  }

  @action
  authorizeFail(e: Error) {
    rootStore.notificationStore.createNotification('authorize', 'error', true, e);
  }

  @computed
  get activeProfile() {
    return this.profiles.find((p) => p.active);
  }

  @action
  setActiveProfile(uuid: string) {
    rootStore.uiStateStore.setChangingProfile(true);
    rootStore.uiStateStore.changeItemTablePage(0);

    fromStream(this.setActiveProfileObservable(uuid));
  }

  @action
  setActiveProfileObservable(uuid: string) {
    return rootStore.signalrHub.invokeEvent<string>('ChangeProfile', uuid).pipe(
      map((uuid: string) => {
        runInAction(() => {
          this.profiles = this.profiles.map((p) => {
            p.active = false;
            return p;
          });
        });
        const foundProfile = this.profiles.find((p) => p.uuid === uuid);
        if (!foundProfile) {
          return throwError('error:no_profile_found');
        }
        runInAction(() => {
          foundProfile.active = true;
        });
        if (rootStore.signalrStore.activeGroup) {
          rootStore.signalrStore.changeProfileForConnection(
            rootStore.signalrStore.ownConnection.connectionId,
            mapProfileToApiProfile(foundProfile, rootStore.settingStore.activeCurrency)
          );
        }
        return this.setActiveProfileSuccess();
      }),
      retryWhen(
        genericRetryStrategy({
          maxRetryAttempts: 5,
          scalingDuration: 5000,
        })
      ),
      catchError((e: AxiosError) => of(this.setActiveProfileFail(e)))
    );
  }

  @action
  updateAccountLeagues(characters: ICharacter[]) {
    this.accountLeagues = [];
    rootStore.leagueStore.leagues.forEach((l) => {
      let accLeague = this.accountLeagues.find((al) => al.leagueId === l.id);
      const leagueCharacters = characters.filter((c) => c.league === l.id);

      accLeague = new AccountLeague(l.id);
      if (leagueCharacters) {
        accLeague.updateCharacters(leagueCharacters);
      }
      this.accountLeagues.push(accLeague);
    });
  }

  @action
  removeActiveProfile() {
    rootStore.uiStateStore.setRemovingProfile(true);
    visitor!.event('Profile', 'Remove profile').send();

    const profileIndex = this.profiles.findIndex((p) => p.active);
    const newActiveProfile = this.profiles.find((p) => !p.active);

    if (profileIndex === -1) {
      this.removeActiveProfileFail(new Error('profile_not_found'));
    }

    fromStream(
      this.setActiveProfileObservable(newActiveProfile!.uuid).pipe(
        switchMap(() => {
          return rootStore.signalrHub.invokeEvent<string>(
            'RemoveProfile',
            this.profiles[profileIndex].uuid
          );
        }),
        map(() => {
          this.deleteProfiles(profileIndex, 1);
          rootStore.uiStateStore.setConfirmRemoveProfileDialogOpen(false);
          return this.removeActiveProfileSuccess();
        }),
        retryWhen(
          genericRetryStrategy({
            maxRetryAttempts: 5,
            scalingDuration: 5000,
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
    rootStore.uiStateStore.setRemovingProfile(false);
    rootStore.notificationStore.createNotification('remove_profile', 'success');
  }

  @action
  removeActiveProfileFail(e: Error) {
    rootStore.uiStateStore.setRemovingProfile(false);
    rootStore.notificationStore.createNotification('remove_profile', 'error', true, e);
  }

  @action
  setActiveProfileSuccess() {
    rootStore.notificationStore.createNotification('set_active_profile', 'success');
    rootStore.uiStateStore.setChangingProfile(false);

    if (this.activeProfile) {
      this.activeProfile.checkPriceStatus();
    }
  }

  @action
  setActiveProfileFail(e: Error) {
    rootStore.notificationStore.createNotification('set_active_profile', 'error', true, e);
    rootStore.uiStateStore.setChangingProfile(false);
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
    rootStore.uiStateStore.setSavingProfile(true);
    const newProfile = new Profile(profile);

    newProfile.active = true;

    const apiProfile = mapProfileToApiProfile(newProfile, rootStore.settingStore.activeCurrency);

    return rootStore.signalrHub.invokeEvent<IApiProfile>('AddProfile', apiProfile).pipe(
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
          scalingDuration: 5000,
        })
      ),
      catchError((e: AxiosError) => of(this.createProfileFail(e)))
    );
  }

  @action
  createProfileFail(e: Error) {
    rootStore.uiStateStore.setSavingProfile(false);
    rootStore.notificationStore.createNotification('create_profile', 'error', false, e);
  }

  @action
  createProfileSuccess() {
    rootStore.uiStateStore.setSavingProfile(false);
    rootStore.notificationStore.createNotification('create_profile', 'success');
  }

  @action
  addProfile(p: Profile) {
    this.profiles.push(p);
    if (rootStore.signalrStore.activeGroup) {
      rootStore.signalrStore.addProfileToConnection(
        rootStore.signalrStore.ownConnection.connectionId,
        mapProfileToApiProfile(p, rootStore.settingStore.activeCurrency)
      );
    }
  }
}

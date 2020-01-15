import { action, computed, observable } from 'mobx';
import { persist } from 'mobx-persist';
import { fromStream } from 'mobx-utils';
import { of } from 'rxjs';
import {
  catchError,
  delay,
  mergeMap,
  retryWhen,
  take,
  map
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

export class Account implements IAccount {
  @persist uuid: string = uuid.v4();
  @persist name: string | undefined = undefined;
  @persist @observable sessionId: string = '';

  @persist('list', AccountLeague)
  @observable
  accountLeagues: AccountLeague[] = [];
  @persist('list', Profile) @observable profiles: Profile[] = [];

  @persist @observable activeProfileUuid: string = '';

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
  authorize(profiles?: IApiProfile[]) {
    return authService
      .getToken({
        uuid: this.uuid,
        name: this.name!,
        accessToken: stores.accountStore.token!.accessToken,
        profiles: profiles
          ? profiles.map(p => {
              return { ...p, snapshots: [] };
            })
          : []
      })
      .pipe(
        mergeMap(token => {
          this.authorizeSuccess();
          return of(stores.signalrStore.signalrHub.startConnection(token.data));
        }),
        retryWhen(
          genericRetryStrategy({
            maxRetryAttempts: 3,
            scalingDuration: 3000
          })
        ),
        catchError(e => of(this.authorizeFail(e)))
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
    const profile = this.profiles.find(p => p.uuid === this.activeProfileUuid);
    return profile ? profile : new Profile();
  }

  @action
  setActiveProfile(uuid: string) {
    stores.uiStateStore.changeItemTablePage(0);
    this.activeProfileUuid = uuid;
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
  checkDefaultProfile() {
    if (this.accountLeagues.length === 0) {
      throw Error('error:no_account_leagues');
    }
    if (stores.leagueStore.priceLeagues.length === 0) {
      throw new Error('error:no_price_leagues');
    }
    if (this.profiles.length === 0) {
      this.profiles.push(
        new Profile({
          name: 'profile 1',
          activeLeagueId: this.accountLeagues[0].leagueId,
          activePriceLeagueId: stores.leagueStore.priceLeagues[0].id,
          shouldSetStashTabs: true
        })
      );
      this.setActiveProfile(this.profiles[0].uuid);
    }
  }

  @action
  removeActiveProfile() {
    stores.uiStateStore.setRemovingProfile(true);
    visitor!.event('Profile', 'Remove profile').send();

    const profileIndex = this.profiles.findIndex(
      p => p.uuid === this.activeProfileUuid
    );

    fromStream(
      stores.signalrHub
        .invokeEvent<string>('RemoveProfile', this.profiles[profileIndex].uuid)
        .pipe(
          map((uuid: string) => {
            if (profileIndex === -1) {
              this.removeActiveProfileFail(new Error('profile_not_found'));
            } else {
              const newActiveProfile = this.profiles.find(
                p => p.uuid !== this.activeProfileUuid
              );
              this.setActiveProfile(newActiveProfile!.uuid);
              this.profiles.splice(profileIndex, 1);
            }
            stores.uiStateStore.setConfirmClearSnapshotsDialogOpen(false);
            return this.removeActiveProfileSuccess();
          }),
          catchError((e: AxiosError) => of(this.removeActiveProfileFail(e)))
        )
    );
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
  setSessionId(sessionId: string) {
    this.sessionId = sessionId;
  }

  @action
  createProfile(profile: IProfile, callback: () => void) {
    stores.uiStateStore.setSavingProfile(true);
    const newProfile = new Profile(profile);

    fromStream(
      stores.signalrHub
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
        )
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

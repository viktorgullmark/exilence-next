import { action, computed, observable, reaction } from 'mobx';
import { persist } from 'mobx-persist';
import uuid from 'uuid';
import { IAccount } from '../../interfaces/account.interface';
import { ICharacter } from '../../interfaces/character.interface';
import { stores } from './../../index';
import { IProfile } from './../../interfaces/profile.interface';
import { AccountLeague } from './account-league';
import { League } from './league';
import { Profile } from './profile';
import { fromStream } from 'mobx-utils';
import { authService } from '../../services/auth.service';
import { switchMap, catchError, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

export class Account implements IAccount {
  @persist uuid: string = uuid.v4();
  @persist name: string = '';
  @persist @observable sessionId: string = '';
  @persist token: string = uuid.v4();

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
    return league!;
  }

  @computed
  get activePriceLeague() {
    const league = stores.leagueStore.priceLeagues.find(
      l => l.id === this.activeProfile.activePriceLeagueId
    );
    return league!;
  }

  @action
  authorize() {
    fromStream(
      authService
        .getToken({ uuid: this.uuid, name: this.name, token: this.token })
        .pipe(
          mergeMap(token => {
            this.authorizeSuccess();
            return of(stores.signalrStore.signalrHub.startConnection());
          }),
          catchError(e => of(this.authorizeFail(e)))
        )
    );
  }

  @action
  authorizeSuccess() {
    console.log('auth success');
  }

  @action
  authorizeFail(e: Error) {
    console.log('auth fail');
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
      const accLeague = this.accountLeagues.find(al => al.leagueId === l.id);
      const leagueCharacters = characters.filter(c => c.league === l.id);

      if (!accLeague && leagueCharacters) {
        const newLeague = new AccountLeague(l.id);
        newLeague.updateCharacters(leagueCharacters);
        this.accountLeagues.push(newLeague);
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
          activePriceLeagueId: stores.leagueStore.priceLeagues[0].id
        })
      );
      this.setActiveProfile(this.profiles[0].uuid);
    }
  }

  @action
  setSessionId(sessionId: string) {
    this.sessionId = sessionId;
  }

  @action
  createProfile(profile: IProfile) {
    const created = new Profile(profile);
    this.profiles.push(created);
    
    stores.signalrStore.updateProfile(created);

    this.setActiveProfile(created.uuid);
  }
}

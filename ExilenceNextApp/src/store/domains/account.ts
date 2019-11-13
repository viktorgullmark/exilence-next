import { action, computed, observable } from 'mobx';
import { persist } from 'mobx-persist';
import uuid from 'uuid';

import { IAccount } from '../../interfaces/account.interface';
import { ICharacter } from '../../interfaces/character.interface';
import { ILeague } from '../../interfaces/league.interface';
import { AccountLeague } from './account-league';
import { Profile } from './profile';
import { IProfile } from './../../interfaces/profile.interface';
import { League } from './league';
import { externalService } from './../../services/external.service';
import { fromStream } from 'mobx-utils';
import { map } from 'rxjs/operators';
import { AxiosResponse } from 'axios';
import { IStash } from './../../interfaces/stash.interface';
import { stores } from './../../index';

export class Account implements IAccount {
  @persist uuid: string = uuid.v4();
  @persist name: string = '';
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
      l => l.uuid === this.activeProfile.activeLeagueUuid
    );
    return league!;
  }

  @computed
  get activePriceLeague() {
    const league = stores.leagueStore.priceLeagues.find(
      l => l.uuid === this.activeProfile.activePriceLeagueUuid
    );
    return league!;
  }

  @computed
  get activeProfile() {
    const profile = this.profiles.find(p => p.uuid === this.activeProfileUuid);
    return profile ? profile : new Profile();
  }

  @action
  setActiveProfile(uuid: string) {
    this.activeProfileUuid = uuid;
  }

  @action
  mapAccountLeagues(
    leagues: League[],
    characters: ICharacter[],
    priceLeagues: League[]
  ) {
    this.accountLeagues = [];
    const mappedLeagues: AccountLeague[] = [];

    leagues.forEach(l => {
      const accLeague = new AccountLeague();
      accLeague.uuid = l.uuid;
      accLeague.updateCharacters(characters.filter(c => c.league === l.id));
      if (accLeague.characters.length > 0) {
        mappedLeagues.push(accLeague);
      }
    });

    if (this.profiles.length === 0) {
      this.profiles.push(
        new Profile({
          name: 'profile 1',
          activeLeagueUuid: mappedLeagues[0]!.uuid,
          activePriceLeagueUuid: priceLeagues[0].uuid
        })
      );
      this.setActiveProfile(this.profiles[0].uuid);
    }

    if (mappedLeagues.length === 0) {
      throw Error('error:no_leagues_with_characters');
    }

    this.accountLeagues = mappedLeagues;
  }

  @action
  setSessionId(sessionId: string) {
    this.sessionId = sessionId;
  }

  @action
  createProfile(profile: IProfile) {
    const created = new Profile(profile);
    this.profiles.push(created);
    this.setActiveProfile(created.uuid);
  }

  @action
  getAllStashTabs() {
    this.accountLeagues.forEach(l => {
      l.getStashTabs();
    })
  }
}

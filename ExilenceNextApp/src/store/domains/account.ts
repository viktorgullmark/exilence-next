import { action, computed, observable } from 'mobx';
import { persist } from 'mobx-persist';
import uuid from 'uuid';

import { IAccount } from '../../interfaces/account.interface';
import { ICharacter } from '../../interfaces/character.interface';
import { ILeague } from '../../interfaces/league.interface';
import { League } from './league';
import { Profile } from './profile';

export class Account implements IAccount {
  @persist uuid: string = uuid.v4();
  @persist name: string = '';
  @persist @observable sessionId: string = '';

  @persist('list', League) @observable leagues: League[] = [];
  @persist('list', Profile) @observable profiles: Profile[] = [
    new Profile({ name: 'profile 1' }),
    new Profile({ name: 'profile 2' })
  ];

  @persist @observable activeProfileUuid: string = '';

  constructor(obj?: IAccount) {
    Object.assign(this, obj);
  }

  @computed
  get priceLeagues() {
    return this.leagues.filter(l => l.id.indexOf('SSF') === -1);
  }

  @computed
  get activeLeague() {
    const league = this.leagues.find(
      l => l.uuid === this.activeProfile.activeLeagueUuid
    );
    return league ? league : new League();
  }

  @computed
  get activePriceLeague() {
    const league = this.leagues.find(
      l => l.uuid === this.activeProfile.activePriceLeagueUuid
    );
    return league ? league : new League();
  }

  @computed
  get activeProfile() {
    const profile = this.profiles.find(p => p.uuid === this.activeProfileUuid);
    return profile ? profile : new Profile();
  }

  @computed
  get leaguesWithCharacters() {
    return this.leagues.filter(l => l.characters.length > 0);
  }

  @computed
  get leagueWithCharacters() {
    return this.leagues.find(l => l.characters.length > 0);
  }

  @action
  setActiveProfile(uuid: string) {
    this.activeProfileUuid = uuid;
  }

  @action
  updateLeagues(leagues: ILeague[]) {
    const newLeagues = leagues.filter(
      l => this.leagues.find(el => el.id === l.id) === undefined
    );
    this.leagues = this.leagues.concat(
      newLeagues.map(league => {
        return new League(league);
      })
    );
  }

  @action
  addCharactersToLeagues(characters: ICharacter[]) {
    this.leagues = this.leagues.map(l => {
      l.updateCharacters(characters.filter(c => c.league === l.id));
      return l;
    });
  }

  @action
  setSessionId(sessionId: string) {
    this.sessionId = sessionId;
  }
}

import { action, observable, computed } from 'mobx';
import { persist } from 'mobx-persist';
import uuid from 'uuid';

import { IAccount } from '../../interfaces/account.interface';
import { ILeague } from '../../interfaces/league.interface';
import { League } from './league';
import { ICharacter } from '../../interfaces/character.interface';

export class Account implements IAccount {
  @persist uuid: string = uuid.v4();
  @persist name: string = '';
  @persist @observable sessionId: string = '';
  @persist @observable activeLeague: string = '';
  @persist @observable activePriceLeague: string = '';

  @persist('list', League) @observable leagues: League[] = [];

  constructor(obj?: IAccount) {
    Object.assign(this, obj);
  }

  @computed
  get leagueWithCharacters() {
    return this.leagues.find(l => l.characters.length > 0);
  }

  @action
  setActiveLeague(uuid: string) {
    this.activeLeague = uuid;
  }

  @action
  setActivePriceLeague(uuid: string) {
    this.activePriceLeague = uuid;
  }

  @action
  updateLeagues(leagues: ILeague[]) {
    const newLeagues = leagues.filter(l => this.leagues.find(el => el.id === l.id) === undefined)
    this.leagues = this.leagues.concat(newLeagues.map(league => {
      return new League(league);
    }));

    const existingLeague = this.leagues.find(l => l.uuid === this.activeLeague);
    const existingPriceLeague = this.leagues.find(
      l => l.uuid === this.activePriceLeague
    );

    if (!existingLeague) {
      this.activeLeague = this.leagues[0].uuid;
    }

    if (!existingPriceLeague) {
      this.activePriceLeague = this.leagues[0].uuid;
    }
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

import { action, makeObservable, observable } from 'mobx';
import { persist } from 'mobx-persist';

import { ILeague } from '../interfaces/league.interface';
import { League } from './domains/league';
import { RootStore } from './rootStore';

export class LeagueStore {
  @persist('list', League) @observable leagues: League[] = [];
  @persist('list', League) @observable priceLeagues: League[] = [];

  constructor(private rootStore: RootStore) {
    makeObservable(this);
  }

  @action
  updateLeagues(leagues: ILeague[]) {
    this.leagues = leagues.map((l) => {
      return new League(l);
    });
  }

  @action
  updatePriceLeagues(leagues: ILeague[]) {
    this.priceLeagues = leagues.map((l) => {
      return new League(l);
    });
  }
}

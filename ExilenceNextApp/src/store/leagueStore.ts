import { action, observable } from 'mobx';
import { persist } from 'mobx-persist';
import { ILeague } from '../interfaces/league.interface';
import { League } from './domains/league';

export class LeagueStore {
  @persist('list', League) @observable leagues: League[] = [];
  @persist('list', League) @observable priceLeagues: League[] = [];

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
  updatePriceLeagues(leagues: ILeague[]) {
    this.priceLeagues = leagues.map(l => {
      return new League(l);
    });
  }
}

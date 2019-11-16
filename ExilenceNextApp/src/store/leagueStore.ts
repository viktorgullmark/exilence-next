import { action, observable, computed } from 'mobx';
import { persist } from 'mobx-persist';
import { ILeague } from '../interfaces/league.interface';
import { League } from './domains/league';
import { UiStateStore } from './uiStateStore';
import { fromStream } from 'mobx-utils';
import { externalService } from '../services/external.service';
import { forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { stores } from '..';

export class LeagueStore {
  uiStateStore: UiStateStore;
  @persist('list', League) @observable leagues: League[] = [];

  constructor(uiStateStore: UiStateStore) {
    this.uiStateStore = uiStateStore;
  }

  @computed
  get priceLeagues() {
    return this.leagues.filter(l => l.id.indexOf('SSF') === -1);
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
}

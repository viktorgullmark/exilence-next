import { action, makeObservable, observable } from 'mobx';
import { v4 as uuidv4 } from 'uuid';

import { LeaguePriceSource } from './league-price-source';

export class LeaguePriceDetails {
  uuid: string = uuidv4();
  leagueId: string = '';

  @observable leaguePriceSources: LeaguePriceSource[] = [];

  constructor() {
    makeObservable(this);
  }

  @action
  addLeaguePriceSource(leaguePriceSource: LeaguePriceSource) {
    this.leaguePriceSources.push(leaguePriceSource);
  }
}

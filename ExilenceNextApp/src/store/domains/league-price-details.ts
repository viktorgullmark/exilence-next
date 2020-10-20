import { action, observable } from 'mobx';
import uuid from 'uuid';

import { LeaguePriceSource } from './league-price-source';

export class LeaguePriceDetails {
  uuid: string = uuid.v4();
  leagueId: string = '';

  @observable leaguePriceSources: LeaguePriceSource[] = [];

  @action
  addLeaguePriceSource(leaguePriceSource: LeaguePriceSource) {
    this.leaguePriceSources.push(leaguePriceSource);
  }
}

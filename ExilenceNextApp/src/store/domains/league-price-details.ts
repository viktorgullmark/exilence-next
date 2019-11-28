import { persist } from 'mobx-persist';
import uuid from 'uuid';
import { LeaguePriceSource } from './league-price-source';
import { observable, action } from 'mobx';
import { ILeaguePriceSource } from './../../interfaces/league-price-source.interface';

export class LeaguePriceDetails {
    uuid: string = uuid.v4();
    leagueId: string = '';
    
    @observable leaguePriceSources: LeaguePriceSource[] = [];

    @action
    addLeaguePriceSource(leaguePriceSource: LeaguePriceSource) {
      this.leaguePriceSources.push(leaguePriceSource);
    }
  }
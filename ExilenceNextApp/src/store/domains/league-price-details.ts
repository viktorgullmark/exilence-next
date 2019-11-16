import { persist } from 'mobx-persist';
import uuid from 'uuid';
import { LeaguePriceSource } from './league-price-source';
import { observable, action } from 'mobx';
import { ILeaguePriceSource } from './../../interfaces/league-price-source.interface';

export class LeaguePriceDetails {
    @persist uuid: string = uuid.v4();
    @persist leagueId: string = '';
    
    @persist('list', LeaguePriceSource) @observable leaguePriceSources: LeaguePriceSource[] = [];

    @action
    addLeaguePriceSource(leaguePriceSource: ILeaguePriceSource) {
      this.leaguePriceSources.push(new LeaguePriceSource(leaguePriceSource));
    }
  }
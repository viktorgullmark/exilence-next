import { persist } from 'mobx-persist';
import uuid from 'uuid';
import { LeaguePriceSource } from './league-price-source';
import { observable } from 'mobx';

export class LeaguePriceDetails {
    @persist uuid: string = uuid.v4();
    @persist leagueUuid: string = '';
    
    @persist('list', LeaguePriceSource) @observable leaguePriceSources: LeaguePriceSource[] = [];
  }
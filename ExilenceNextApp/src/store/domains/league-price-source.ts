import { action, observable } from 'mobx';
import { persist } from 'mobx-persist';
import uuid from 'uuid';
import { IExternalPrice } from '../../interfaces/external-price.interface';
import { ILeaguePriceSource } from '../../interfaces/league-price-source.interface';

export class LeaguePriceSource {
  @persist uuid: string = uuid.v4();
  @persist priceSourceUuid: string = '';

  prices: IExternalPrice[] = [];

  constructor(obj?: ILeaguePriceSource) {
    Object.assign(this, obj);
  }

  @action
  updatePrices(newPrices: IExternalPrice[]) {
    this.prices = newPrices;
  }
}

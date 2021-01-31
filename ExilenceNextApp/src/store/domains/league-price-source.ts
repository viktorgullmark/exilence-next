import { action, makeObservable } from 'mobx';
import { v4 as uuidv4 } from 'uuid';
import { IExternalPrice } from '../../interfaces/external-price.interface';
import { ILeaguePriceSource } from '../../interfaces/league-price-source.interface';

export class LeaguePriceSource {
  uuid: string = uuidv4();
  priceSourceUuid: string = '';

  prices: IExternalPrice[] = [];

  constructor(obj?: ILeaguePriceSource) {
    makeObservable(this);
    Object.assign(this, obj);
  }

  @action
  updatePrices(newPrices: IExternalPrice[]) {
    this.prices = newPrices;
  }
}

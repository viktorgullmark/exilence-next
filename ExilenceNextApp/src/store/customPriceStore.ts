import { action, makeObservable, observable } from 'mobx';
import { persist } from 'mobx-persist';
import { IExternalPrice } from '../interfaces/external-price.interface';
import { findPrice } from '../utils/price.utils';
import { RootStore } from './rootStore.js';

export class CustomPriceStore {
  // todo: add support for multiple leagues
  @observable @persist('list') customPrices: IExternalPrice[] = [];

  constructor(private rootStore: RootStore) {
    makeObservable(this);
  }

  @action
  addOrUpdateCustomPrice(customPrice: IExternalPrice) {
    const foundItem = findPrice(this.customPrices, customPrice);
    if (foundItem) {
      const index = this.customPrices.indexOf(foundItem);
      this.customPrices[index] = customPrice;
    } else {
      this.customPrices.push(customPrice);
    }
  }
}

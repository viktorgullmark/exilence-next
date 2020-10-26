import { action, computed, makeObservable, toJS } from 'mobx';
import { v4 as uuidv4 } from 'uuid';
import { rootStore } from '../..';
import { IExternalPrice } from '../../interfaces/external-price.interface';
import { ILeaguePriceSource } from '../../interfaces/league-price-source.interface';
import { filterPrices, findPrice } from '../../utils/price.utils';

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

  @computed get pricesWithCustomValues() {
    return filterPrices(
      this.prices.filter((p) => {
        const foundCustomPrice = findPrice(rootStore.customPriceStore.customPrices, p);
        if (foundCustomPrice) {
          p.customPrice = foundCustomPrice.customPrice ? +foundCustomPrice.customPrice : 0;
        }
        return p;
      })
    );
  }
}

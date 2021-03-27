import { action, makeObservable, observable } from 'mobx';
import { persist } from 'mobx-persist';
import { IExternalPrice } from '../interfaces/external-price.interface';
import { ILeaguePrices } from '../interfaces/league-prices';
import { IPricedItem } from '../interfaces/priced-item.interface';
import { findPrice, findPriceForItem } from '../utils/price.utils';
import { RootStore } from './rootStore.js';

export class CustomPriceStore {
  @observable @persist('list') customLeaguePrices: ILeaguePrices[] = [];

  constructor(private rootStore: RootStore) {
    makeObservable(this);
  }

  @action
  addOrUpdateCustomPrice(customPrice: IExternalPrice, leagueId: string) {
    const leaguePrices = this.customLeaguePrices.find((lp) => lp.leagueId === leagueId);
    if (!leaguePrices) {
      this.customLeaguePrices.push({ leagueId: leagueId, prices: [customPrice] });
    } else {
      const foundItem = findPrice(leaguePrices.prices, customPrice);
      if (foundItem) {
        const index = leaguePrices.prices.indexOf(foundItem);
        leaguePrices.prices[index] = customPrice;
      } else {
        leaguePrices.prices.push(customPrice);
      }
    }
  }

  @action
  removeCustomPrice(customPrice: IExternalPrice, leagueId: string) {
    const leaguePrices = this.customLeaguePrices.find((lp) => lp.leagueId === leagueId);
    if (!leaguePrices) {
      return;
    } else {
      const foundItem = findPrice(leaguePrices.prices, customPrice);
      if (foundItem) {
        const index = leaguePrices.prices.indexOf(foundItem);
        leaguePrices.prices.splice(index, 1);
      }
    }
  }

  @action
  findCustomPriceForItem(item: IPricedItem, leagueId?: string) {
    const leaguePrices = this.customLeaguePrices.find((lp) => lp.leagueId === leagueId);
    if (leaguePrices) {
      return findPriceForItem(leaguePrices.prices, item);
    }
    return;
  }
}

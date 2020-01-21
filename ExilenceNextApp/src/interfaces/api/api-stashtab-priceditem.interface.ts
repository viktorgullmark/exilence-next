import { IPricedItem } from './api-priced-item.interface';

export interface IApiStashTabPricedItem {
  uuid: string;
  stashTabId: string;
  pricedItems: IPricedItem[];
}

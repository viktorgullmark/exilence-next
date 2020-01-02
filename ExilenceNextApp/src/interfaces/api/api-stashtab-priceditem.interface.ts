import { IApiPricedItem } from './api-priced-item.interface';

export interface IApiStashTabPricedItem {
  stashTabId: string;
  pricedItems: IApiPricedItem[];
}

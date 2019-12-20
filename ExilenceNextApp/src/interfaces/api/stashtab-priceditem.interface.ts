import { IApiPricedItem } from './priceditem.interface';

export interface IApiStashTabPricedItem {
  stashTabId: string;
  pricedItems: IApiPricedItem[];
}

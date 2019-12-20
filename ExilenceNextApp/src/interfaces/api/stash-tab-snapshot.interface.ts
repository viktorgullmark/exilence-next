import { IPricedItem } from '../priced-item.interface';
import { IApiPricedItem } from './priceditem.interface';

export interface IApiStashTabSnapshot {
  uuid: string;
  value: number;
  pricedItems: IApiPricedItem[];
  index: number;
  name: string;
  color: string;
}

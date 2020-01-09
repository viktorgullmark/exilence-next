import { IPricedItem } from '../priced-item.interface';

export interface IApiStashTabSnapshot {
  uuid: string;
  value: number;
  pricedItems: IPricedItem[];
  index: number;
  name: string;
  color: string;
}

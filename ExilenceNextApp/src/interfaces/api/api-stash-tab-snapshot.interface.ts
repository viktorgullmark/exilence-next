import { IPricedItem } from '../priced-item.interface';

export interface IApiStashTabSnapshot {
  uuid: string;
  value: number;
  stashTabId: string;
  pricedItems: IPricedItem[];
  index: number;
  name: string;
  color: string;
  created: Date;
}

import { IPricedItem } from './priced-item.interface';

export interface IStashTabSnapshot {
  stashTabId: string;
  value: number;
  items: IPricedItem[];
}

import { ICompactTab } from './stash.interface';

export interface ITableItem {
  tabs: ICompactTab[];
  name: string;
  frameType: number;
  calculated: number;
  total: number;
  max: number;
  mean: number;
  median: number;
  min: number;
  mode: number;
  stackSize: number;
  totalStacksize: number;
  links: number;
  quality: number;
  level: number;
  corrupted: boolean;
  icon: string;
  sockets: number;
}

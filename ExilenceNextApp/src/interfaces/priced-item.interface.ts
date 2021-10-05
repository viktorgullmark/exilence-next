import { ICompactTab } from './stash.interface';

export interface IPricedItem {
  uuid: string;
  name: string;
  itemId: string;
  typeLine: string;
  frameType: number;
  total: number;
  calculated: number;
  max: number;
  elder: boolean;
  shaper: boolean;
  blighted: boolean;
  mean: number;
  median: number;
  min: number;
  mode: number;
  ilvl: number;
  stackSize: number;
  totalStacksize: number;
  links: number;
  quality: number;
  level: number;
  corrupted: boolean;
  icon: string;
  sockets: number;
  variant: string;
  tier: number;
  inventoryId: string;
  tab: ICompactTab[];
  detailsUrl?: string;
}

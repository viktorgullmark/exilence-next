import { IPoeWatchListingItemBuyout } from './poe-watch-item-listing-buyout.interface';
export interface IPoeWatchItemListing {
  id: number;
  name: string;
  type: string;
  category: string;
  group: string;
  frame: number;
  icon: string;
  discovered: Date;
  updated: Date;
  count: number;
  buyout: IPoeWatchListingItemBuyout[];
}

import { PoeWatchListingItemBuyout as PoeWatchItemListingBuyout } from './poe-watch-item-listing-buyout.interface';



    export interface PoeWatchItemListing {
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
        buyout: PoeWatchItemListingBuyout[];
    }
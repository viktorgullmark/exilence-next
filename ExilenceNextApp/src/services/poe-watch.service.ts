import axios from 'axios';
import { forkJoin, from } from 'rxjs';
import RateLimiter from 'rxjs-ratelimiter';
import { map } from 'rxjs/operators';
import { PriceHelper } from '../helpers/price.helper';
import { IPoeWatchCategory } from '../interfaces/poe-watch/poe-watch-category.interface';
import { IPoeWatchCombinedPriceItemData } from '../interfaces/poe-watch/poe-watch-combined-price-item-data.interface';
import { IPoeWatchCompactPriceData } from '../interfaces/poe-watch/poe-watch-compact-price-data.interface';
import { IPoeWatchItemListing } from '../interfaces/poe-watch/poe-watch-item-listing.interface';
import { IPoeWatchItem } from '../interfaces/poe-watch/poe-watch-item.interface';

const rateLimiter = new RateLimiter(1, 1);
const apiUrl = 'https://api.poe.watch';

export const poewatchService = {
};

function getItemdata() {
  return rateLimiter.limit(
    from(axios.get<IPoeWatchItem[]>(`${apiUrl}/itemdata`))
  );
}

function getCategories() {
  return rateLimiter.limit(
    from(axios.get<IPoeWatchCategory[]>(`${apiUrl}/categories`))
  );
}

function getCompactPriceData(league: string) {
  const parameters = `?league=${league}`;
  return rateLimiter.limit(
    from(axios.get<IPoeWatchCompactPriceData[]>(`${apiUrl}/compact${parameters}`))
  );
}

function getTradeListingsForAccount(league: string, account: string) {
  const parameters = `?league=${league}&account=${account}`;
  return rateLimiter.limit(
    from(axios.get<IPoeWatchItemListing[]>(`${apiUrl}/listings${parameters}`))
  );
}

function getPrices(league: string) {
  return forkJoin(getItemdata(), getCompactPriceData(league)).pipe(
    map((results: any[]) => {
      const itemData: IPoeWatchItem[] = results[0];
      const priceData: IPoeWatchCompactPriceData[] = results[1];
      const combinedData: IPoeWatchCombinedPriceItemData[] = itemData
        .map((item: any) => {
          return {...item, ...priceData.find(price => price.id === item.id) }; });

      return combinedData.map(data => PriceHelper.getExternalPriceFromWatchItem(data));
    })
  );
}
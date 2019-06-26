import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import RateLimiter from 'rxjs-ratelimiter';
import { PoeWatchItem } from '../../shared/interfaces/poe-watch/poe-watch-item.interface';
import { PoeWatchCompactPriceData } from '../../shared/interfaces/poe-watch/poe-watch-compact-price-data.interface';
import { PoeWatchItemListing } from '../../shared/interfaces/poe-watch/poe-watch-item-listing.interface';
import { PoeWatchCategory } from '../../shared/interfaces/poe-watch/poe-watch-category.interface';

@Injectable({
  providedIn: 'root'
})
export class PoeWatchService {

  private rateLimiter = new RateLimiter(1, 1);

  constructor(private http: HttpClient) { }

  getItemdata() {
    return this.rateLimiter.limit(
      this.http.get<PoeWatchItem[]>('https://api.poe.watch/itemdata')
    );
  }

  getCategories() {
    return this.rateLimiter.limit(
      this.http.get<PoeWatchCategory[]>('https://api.poe.watch/categories')
    );
  }

  getCompactPriceData(league: string) {
    const parameters = `?league=${league}`;
    return this.rateLimiter.limit(
      this.http.get<PoeWatchCompactPriceData[]>('https://api.poe.watch/compact' + parameters)
    );
  }

  getTradeListingsForAccount(league: string, account: string) {
    const parameters = `?league=${league}&account=${account}`;
    return this.rateLimiter.limit(
      this.http.get<PoeWatchItemListing[]>('https://api.poe.watch/listings' + parameters)
    );
  }

}

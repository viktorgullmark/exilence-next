import { HttpClient } from '@angular/common/http';
import { of, from, forkJoin } from 'rxjs';
import RateLimiter from 'rxjs-ratelimiter';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/take';
import { PoeNinjaCurrencyOverview } from '../../../shared/interfaces/poe-ninja/poe-ninja-currency-overview.interface';
import { PoeNinjaItemOverview } from '../../../shared/interfaces/poe-ninja/poe-ninja-item-overview.interface';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ExternalPrice } from '../../../shared/interfaces/external-price.interface';
import { PriceHelper } from '../../../shared/helpers/price.helper';

@Injectable()
export class PoeNinjaService {

  private rateLimiter = new RateLimiter(1, 1);

  constructor(private http: HttpClient) { }

  getCurrencyCategories() {
    const categories = [
      'Currency',
      'Fragment'
    ];
    return categories;
  }

  getItemCategories() {
    const categories = [
      'Incubator',
      'Fossil',
      'Resonator',
      'Essence',
      'DivinationCard',
      'Prophecy',
      'SkillGem',
      'BaseType',
      'HelmetEnchant',
      'UniqueMap',
      'Map',
      'UniqueJewel',
      'UniqueFlask',
      'UniqueWeapon',
      'UniqueArmour',
      'UniqueAccessory',
      'Beast'
    ];
    return categories;
  }

  getItemCategoryOverview(league: string, type: string) {
    const parameters = `?league=${league}&type=${type}`;
    return this.rateLimiter.limit(
      this.http.get<PoeNinjaItemOverview>('https://poe.ninja/api/data/itemoverview' + parameters)
    );
  }

  getCurrencyCategoryOverview(league: string, type: string) {
    const parameters = `?league=${league}&type=${type}`;
    return this.rateLimiter.limit(
      this.http.get<PoeNinjaCurrencyOverview>('https://poe.ninja/api/data/currencyoverview' + parameters)
    );
  }

  getItemPrices(league: string) {
    return forkJoin(this.getItemCategories().map((type: any) => {
      return this.getItemCategoryOverview(league, type).pipe(map((itemOverview: PoeNinjaItemOverview) => {
        if (itemOverview !== null) {
          return itemOverview.lines.map(lines => {
            return PriceHelper.getExternalPriceFromNinjaItem(lines) as ExternalPrice;
          });
        }
      }));
    })
    );
  }

  getCurrencyPrices(league: string) {
    return forkJoin(this.getCurrencyCategories().map((type: any) => {
      return this.getCurrencyCategoryOverview(league, type).pipe(map((currOverview: PoeNinjaCurrencyOverview) => {
        if (currOverview !== null) {
          return currOverview.lines.map(lines => {
            const currencyDetail = currOverview.currencyDetails.find(detail => detail.name === lines.currencyTypeName);
            return PriceHelper.getExternalPriceFromNinjaCurrencyItem(lines, currencyDetail) as ExternalPrice;
          });
        }
      }));
    })
    );
  }

}

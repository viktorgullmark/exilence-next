import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import RateLimiter from 'rxjs-ratelimiter';

import { PoeNinjaCurrencyOverview } from '../../../shared/interfaces/poe-ninja/poe-ninja-currency-overview.interface';
import { PoeNinjaItemOverview } from '../../../shared/interfaces/poe-ninja/poe-ninja-item-overview.interface';
import { Injectable } from '@angular/core';

@Injectable()
export class PoeNinjaService {

  private rateLimiter = new RateLimiter(1, 1);

  constructor(private http: HttpClient) { }

  getCurrencyCategories() {
    const categories = [
      'Currency',
      'Fragment'
    ];
    return of(categories);
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
      'UniqueAcessory',
      'Beast'
    ];
    return of(categories);
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

}

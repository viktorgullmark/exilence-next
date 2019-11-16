import RateLimiter from 'rxjs-ratelimiter';
import { map, concatAll, flatMap } from 'rxjs/operators';
import { forkJoin, from } from 'rxjs';
import { IPoeNinjaCurrencyOverview } from './../interfaces/poe-ninja/poe-ninja-currency-overview.interface';
import { IExternalPrice } from '../interfaces/external-price.interface';
import axios, { AxiosResponse } from 'axios';
import { IPoeNinjaItemOverview } from '../interfaces/poe-ninja/poe-ninja-item-overview.interface';
import { PriceHelper } from '../helpers/price.helper';

const rateLimiter = new RateLimiter(1, 1);
const apiUrl = 'https://poe.ninja/api/data';

export const poeninjaService = {
  getCurrencyCategories,
  getItemCategories,
  getItemCategoryOverview,
  getCurrencyCategoryOverview,
  getItemPrices,
  getCurrencyPrices
};

function getCurrencyCategories() {
  const categories = ['Currency', 'Fragment'];
  return categories;
}

function getItemCategories() {
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

function getItemCategoryOverview(league: string, type: string) {
  const parameters = `?league=${league}&type=${type}`;
  return rateLimiter.limit(
    from(
      axios.get<IPoeNinjaItemOverview>(`${apiUrl}/itemoverview${parameters}`)
    )
  );
}

function getCurrencyCategoryOverview(league: string, type: string) {
  const parameters = `?league=${league}&type=${type}`;
  return rateLimiter.limit(
    from(
      axios.get<IPoeNinjaCurrencyOverview>(
        `${apiUrl}/currencyoverview${parameters}`
      )
    )
  );
}

function getItemPrices(league: string) {
  return forkJoin(
    getItemCategories().map(type => {
      return getItemCategoryOverview(league, type).pipe(
        map((response: AxiosResponse<IPoeNinjaItemOverview>) => {
          return response.data.lines.map(lines => {
            return PriceHelper.getExternalPriceFromNinjaItem(
              lines
            ) as IExternalPrice;
          });
        })
      );
    })
  ).pipe(map((arrays) => arrays.reduce((acc, array) => [...acc, ...array], [])));
}

function getCurrencyPrices(league: string) {
  return forkJoin(
    getCurrencyCategories().map(type => {
      return getCurrencyCategoryOverview(league, type).pipe(
        map((response: AxiosResponse<IPoeNinjaCurrencyOverview>) => {
          return response.data.lines.map(lines => {
            const currencyDetail = response.data.currencyDetails.find(
              detail => detail.name === lines.currencyTypeName
            );
            return PriceHelper.getExternalPriceFromNinjaCurrencyItem(
              lines,
              currencyDetail
            ) as IExternalPrice;
          });
        })
      );
    })
  ).pipe(map((arrays) => arrays.reduce((acc, array) => [...acc, ...array], [])));
}

import { IExternalPrice } from '../interfaces/external-price.interface';
import { IPoeNinjaCurrencyOverviewCurrencyDetail } from '../interfaces/poe-ninja/poe-ninja-currency-overview-currency-detail.interface';
import { IPoeNinjaCurrencyOverviewLine } from '../interfaces/poe-ninja/poe-ninja-currency-overview-line.interface';
import { IPoeNinjaItemOverviewLine } from '../interfaces/poe-ninja/poe-ninja-item-overview-line.interface';
import { IPoeWatchCombinedPriceItemData } from '../interfaces/poe-watch/poe-watch-combined-price-item-data.interface';
import { IPricedItem } from '../interfaces/priced-item.interface';
import AppConfig from './../config/app.config';
import { getNinjaLeagueUrl, getNinjaTypeUrl } from './ninja.utils';

export function getExternalPriceFromWatchItem(
  item: IPoeWatchCombinedPriceItemData
): IExternalPrice {
  return {
    name: item.name,
    icon: item.icon,
    max: item.max,
    mean: item.mean,
    median: item.median,
    min: item.min,
    mode: item.mode,
    frameType: item.frame,
    shaper: item.baseIsShaper,
    elder: item.baseIsElder,
    links: item.linkCount,
    level: item.gemLevel,
    ilvl: item.baseItemLevel,
    variant: item.variation,
    baseType: item.type,
    corrupted: item.gemIsCorrupted,
    calculated: 0,
    totalStacksize: item.stackSize,
    tier: item.tier,
    quality: item.gemQuality,
  } as IExternalPrice;
}

export function getExternalPriceFromNinjaItem(
  item: IPoeNinjaItemOverviewLine,
  type: string,
  league: string
) {
  const detailsUrl = `${AppConfig.poeNinjaBaseUrl}/${getNinjaLeagueUrl(
    league.toLowerCase()
  )}/${getNinjaTypeUrl(type)}/${item.detailsId}`;
  return {
    name: item.name,
    icon: item.icon,
    calculated: item.chaosValue,
    links: item.links,
    variant: item.variant !== null && item.variant !== undefined ? item.variant : '',
    elder: item.variant === 'Elder' ? true : false,
    shaper: item.variant === 'Shaper' ? true : false,
    level: item.gemLevel,
    frameType: item.itemClass,
    baseType: item.baseType,
    ilvl: item.levelRequired,
    corrupted: item.corrupted,
    totalStacksize: item.stackSize,
    tier: item.mapTier,
    count: item.count,
    quality: item.gemQuality,
    detailsUrl: detailsUrl,
  } as IExternalPrice;
}

export function getExternalPriceFromNinjaCurrencyItem(
  item: IPoeNinjaCurrencyOverviewLine,
  details: IPoeNinjaCurrencyOverviewCurrencyDetail | undefined,
  type: string,
  league: string
) {
  const detailsUrl = `${AppConfig.poeNinjaBaseUrl}/${getNinjaLeagueUrl(
    league.toLowerCase()
  )}/${getNinjaTypeUrl(type)}/${item.detailsId}`;
  const calculated = item.receive ? item.receive.value : 0;

  return {
    name: item.currencyTypeName,
    calculated: calculated,
    icon: details !== undefined ? details.icon : undefined,
    count: item.receive ? item.receive.count : 0,
    detailsUrl: detailsUrl,
  } as IExternalPrice;
}

export function mapPriceToItem(item: IPricedItem, price: IExternalPrice) {
  if (price !== undefined) {
    item.calculated = price.calculated ? price.calculated : 0;
    item.max = price.max || 0;
    item.mean = price.mean || 0;
    item.mode = price.mode || 0;
    item.min = price.min || 0;
    item.median = price.median || 0;
    item.detailsUrl = price.detailsUrl;
  }
  return item;
}

export function mapApiPricedItemToPricedItem(item: IPricedItem) {
  return { id: item.itemId, ...item } as IPricedItem;
}

export function excludeLegacyMaps(prices: IExternalPrice[]) {
  const legacyMapVariants = ['Pre 2.0', 'Atlas2', 'Atlas2-3.4'];
  return prices.filter((p) => !p.variant || !legacyMapVariants.includes(p.variant));
}

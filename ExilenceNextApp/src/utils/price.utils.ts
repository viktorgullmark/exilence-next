import { rootStore } from '..';
import { IExternalPrice } from '../interfaces/external-price.interface';
import { IPoeNinjaCurrencyOverviewCurrencyDetail } from '../interfaces/poe-ninja/poe-ninja-currency-overview-currency-detail.interface';
import { IPoeNinjaCurrencyOverviewLine } from '../interfaces/poe-ninja/poe-ninja-currency-overview-line.interface';
import { IPoeNinjaItemOverviewLine } from '../interfaces/poe-ninja/poe-ninja-item-overview-line.interface';
import { IPoeWatchCombinedPriceItemData } from '../interfaces/poe-watch/poe-watch-combined-price-item-data.interface';
import { IPricedItem } from '../interfaces/priced-item.interface';
import { ISparklineDataPoint } from '../interfaces/sparkline-data-point.interface';
import AppConfig from './../config/app.config';
import { getNinjaLeagueUrl, getNinjaTypeUrl } from './ninja.utils';

export function getExternalPriceFromWatchItem(
  item: IPoeWatchCombinedPriceItemData
): IExternalPrice {
  return {
    name: item.name,
    icon: item.icon,
    max: item.max ?? 0,
    mean: item.mean ?? 0,
    median: item.median ?? 0,
    min: item.min ?? 0,
    mode: item.mode ?? 0,
    frameType: item.frame ?? 0,
    shaper: item.baseIsShaper,
    elder: item.baseIsElder,
    links: item.linkCount ?? 0,
    level: item.gemLevel ?? 0,
    ilvl: item.baseItemLevel ?? 0,
    variant: item.variation,
    baseType: item.type,
    corrupted: item.gemIsCorrupted,
    calculated: 0,
    totalStacksize: item.stackSize ?? 0,
    tier: item.tier ?? 0,
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
    calculated: item.chaosValue ?? 0,
    links: item.links ?? 0,
    variant: item.variant !== null && item.variant !== undefined ? item.variant : '',
    elder: item.variant === 'Elder' ? true : false,
    shaper: item.variant === 'Shaper' ? true : false,
    level: item.gemLevel ?? 0,
    frameType: item.itemClass ?? 0,
    baseType: item.baseType,
    ilvl: item.levelRequired ?? 0,
    corrupted: item.corrupted ?? false,
    totalStacksize: item.stackSize ?? 0,
    tier: item.mapTier ?? 0,
    count: item.count ?? 0,
    quality: item.gemQuality ?? 0,
    detailsUrl: detailsUrl,
    sparkLine: item.count > 10 ? item.sparkline : item.lowConfidenceSparkline,
  } as IExternalPrice;
}

export function formatSparklineChartData(data: number[]): ISparklineDataPoint[] | undefined {
  if (data.length === 0) {
    return;
  }
  return data.map((val, i) => {
    return {
      x: i + 1,
      y: val,
    } as ISparklineDataPoint;
  });
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
  const sparkLine = item.receiveSparkLine ? item.receiveSparkLine : undefined;

  return {
    name: item.currencyTypeName,
    calculated: calculated,
    icon: details !== undefined ? details.icon : undefined,
    count: item.receive ? item.receive.count : 0,
    frameType: 5,
    detailsUrl: detailsUrl,
    sparkLine:
      item.receive && item.receive.count > 10 ? sparkLine : item.lowConfidenceReceiveSparkLine,
  } as IExternalPrice;
}

export const filterPrices = (prices: IExternalPrice[]) => {
  if (prices.length === 0) {
    return [];
  }
  const filterText = rootStore.uiStateStore.priceTableFilterText.toLowerCase();

  return prices.filter((p) => {
    return p.name.toLowerCase().includes(filterText);
  });
};

export function mapPriceToItem(item: IPricedItem, price: IExternalPrice, customPrice?: number) {
  if (price !== undefined) {
    item.calculated = customPrice ? customPrice : price.calculated || 0;
    item.max = price.max || 0;
    item.mean = price.mean || 0;
    item.mode = price.mode || 0;
    item.min = price.min || 0;
    item.median = price.median || 0;
    item.detailsUrl = price.detailsUrl;
  }
  return item;
}

export function findPrice<T extends IExternalPrice>(array: T[], priceToFind: T) {
  return array.find(
    (x) =>
      x.name === priceToFind.name &&
      x.quality === priceToFind.quality &&
      x.links === priceToFind.links &&
      x.level === priceToFind.level &&
      x.corrupted === priceToFind.corrupted &&
      x.frameType === priceToFind.frameType &&
      x.variant === priceToFind.variant &&
      x.elder === priceToFind.elder &&
      x.shaper === priceToFind.shaper &&
      x.ilvl === priceToFind.ilvl &&
      x.icon === priceToFind.icon &&
      x.tier === priceToFind.tier
  );
}

export function findPriceForItem(array: IExternalPrice[], priceToFind: IPricedItem) {
  return array.find(
    (x) =>
      x.name === priceToFind.name &&
      x.quality === priceToFind.quality &&
      x.links === priceToFind.links &&
      x.level === priceToFind.level &&
      x.corrupted === priceToFind.corrupted &&
      x.frameType === priceToFind.frameType &&
      x.variant === priceToFind.variant &&
      x.elder === priceToFind.elder &&
      x.shaper === priceToFind.shaper &&
      x.ilvl === priceToFind.ilvl &&
      x.icon === priceToFind.icon &&
      x.tier === priceToFind.tier
  );
}

export function getRawPriceFromPricedItem(item: IPricedItem): IExternalPrice {
  return {
    calculated: item.calculated,
    name: item.name,
    icon: item.icon,
    quality: item.quality,
    links: item.links,
    level: item.level,
    corrupted: item.corrupted,
    frameType: item.frameType,
    variant: item.variant,
    elder: item.elder,
    shaper: item.shaper,
    ilvl: item.ilvl,
    tier: item.tier,
    count: 1,
  };
}

export function mapApiPricedItemToPricedItem(item: IPricedItem) {
  return { id: item.itemId, ...item } as IPricedItem;
}

export function excludeLegacyMaps(prices: IExternalPrice[]) {
  const acceptedMaps = [', Gen-12', ', Gen-13', ', Gen-14', ', Gen-15', ', Gen-16', 'expedition'];
  return prices.filter((p) => p.tier === 0 || !p.variant || acceptedMaps.includes(p.variant));
}

export function excludeInvalidItems(prices: IExternalPrice[]) {
  const invalidItems = ['Charged Compass'];
  return prices.filter((p) => !invalidItems.includes(p.name));
}

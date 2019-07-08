import { ExternalPrice } from '../interfaces/external-price.interface';
import { PoeWatchCombinedPriceItemData } from '../interfaces/poe-watch/poe-watch-combined-price-item-data.interface';
import { PoeNinjaCurrencyOverview } from '../interfaces/poe-ninja/poe-ninja-currency-overview.interface';
import { PoeNinjaItemOverview } from '../interfaces/poe-ninja/poe-ninja-item-overview.interface';
import { PoeNinjaItemOverviewLine } from '../interfaces/poe-ninja/poe-ninja-item-overview-line.interface';
import { PoeNinjaCurrencyOverviewLine } from '../interfaces/poe-ninja/poe-ninja-currency-overview-line.interface';
import { PoeNinjaCurrencyOverviewCurrencyDetail } from '../interfaces/poe-ninja/poe-ninja-currency-overview-currency-detail.interface';

export class PriceHelper {
    public static getExternalPriceFromWatchItem(item: PoeWatchCombinedPriceItemData): ExternalPrice {
        return {
            name: item.name,
            icon: item.icon,
            max: item.max,
            mean: item.mean,
            median: item.median,
            min: item.min,
            mode: item.mode,
            links: item.linkCount,
            level: item.gemLevel,
            corrupted: item.gemIsCorrupted,
            totalStacksize: item.stackSize
        } as ExternalPrice;
    }

    public static getExternalPriceFromNinjaItem(item: PoeNinjaItemOverviewLine) {
        return {
            name: item.name,
            icon: item.icon,
            calculated: item.chaosValue,
            links: item.links,
            level: item.gemLevel,
            corrupted: item.corrupted,
            totalStacksize: item.stackSize
        } as ExternalPrice;
    }


    public static getExternalPriceFromNinjaCurrencyItem(
        item: PoeNinjaCurrencyOverviewLine,
        details: PoeNinjaCurrencyOverviewCurrencyDetail) {
        return {
            name: item.currencyTypeName,
            calculated: item.chaosEquivalent,
            icon: details !== undefined ? details.icon : undefined
        } as ExternalPrice;
    }
}

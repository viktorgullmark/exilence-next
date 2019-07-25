import { ExternalPrice } from '../interfaces/external-price.interface';
import { PoeWatchCombinedPriceItemData } from '../interfaces/poe-watch/poe-watch-combined-price-item-data.interface';
// import { PoeNinjaCurrencyOverview } from '../interfaces/poe-ninja/poe-ninja-currency-overview.interface';
// import { PoeNinjaItemOverview } from '../interfaces/poe-ninja/poe-ninja-item-overview.interface';
import { PoeNinjaItemOverviewLine } from '../interfaces/poe-ninja/poe-ninja-item-overview-line.interface';
import { PoeNinjaCurrencyOverviewLine } from '../interfaces/poe-ninja/poe-ninja-currency-overview-line.interface';
import { PoeNinjaCurrencyOverviewCurrencyDetail } from '../interfaces/poe-ninja/poe-ninja-currency-overview-currency-detail.interface';
import { PricedItem } from '../interfaces/priced-item.interface';

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
            tier: item.tier
        } as ExternalPrice;
    }

    public static getExternalPriceFromNinjaItem(item: PoeNinjaItemOverviewLine) {
        return {
            name: item.name,
            icon: item.icon,
            calculated: item.chaosValue,
            links: item.links,
            variant: item.variant,
            elder: item.variant === 'Elder',
            shaper: item.variant === 'Shaper',
            level: item.gemLevel,
            frameType: item.itemClass,
            baseType: item.baseType,
            ilvl: item.levelRequired,
            corrupted: item.corrupted,
            totalStacksize: item.stackSize,
            tier: item.mapTier
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

    // public static mapPriceToItem(item: PricedItem, price: ExternalPrice) {
    //     if (price !== undefined) {
    //         item.calculated = price.calculated;
    //         item.max = price.max;
    //         item.mean = price.mean;
    //         item.mode = price.mode;
    //         item.min = price.min;
    //         item.median = price.median;
    //     }
    //     return item;
    // }
}

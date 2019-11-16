import { IExternalPrice } from '../interfaces/external-price.interface';
import { IPoeWatchCombinedPriceItemData } from '../interfaces/poe-watch/poe-watch-combined-price-item-data.interface';
import { IPoeNinjaCurrencyOverview } from '../interfaces/poe-ninja/poe-ninja-currency-overview.interface';
import { IPoeNinjaItemOverview } from '../interfaces/poe-ninja/poe-ninja-item-overview.interface';
import { IPoeNinjaItemOverviewLine } from '../interfaces/poe-ninja/poe-ninja-item-overview-line.interface';
import { IPoeNinjaCurrencyOverviewLine } from '../interfaces/poe-ninja/poe-ninja-currency-overview-line.interface';
import { IPoeNinjaCurrencyOverviewCurrencyDetail } from '../interfaces/poe-ninja/poe-ninja-currency-overview-currency-detail.interface';
import { IPricedItem } from '../interfaces/priced-item.interface';

export class PriceHelper {
    public static getExternalPriceFromWatchItem(item: IPoeWatchCombinedPriceItemData): IExternalPrice {
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
        } as IExternalPrice;
    }

    public static getExternalPriceFromNinjaItem(item: IPoeNinjaItemOverviewLine) {
        return {
            name: item.name,
            icon: item.icon,
            calculated: item.chaosValue,
            links: item.links,
            variant: item.variant,
            elder: item.variant === 'Elder' ? true : false,
            shaper: item.variant === 'Shaper' ? true : false,
            level: item.gemLevel,
            frameType: item.itemClass,
            baseType: item.baseType,
            ilvl: item.levelRequired,
            corrupted: item.corrupted,
            totalStacksize: item.stackSize,
            tier: item.mapTier
        } as IExternalPrice;
    }

    public static getExternalPriceFromNinjaCurrencyItem(
        item: IPoeNinjaCurrencyOverviewLine,
        details: IPoeNinjaCurrencyOverviewCurrencyDetail | undefined) {
        return {
            name: item.currencyTypeName,
            calculated: item.chaosEquivalent,
            icon: details !== undefined ? details.icon : undefined
        } as IExternalPrice;
    }

    public static mapPriceToItem(item: IPricedItem, price: IExternalPrice) {
        if (price !== undefined) {
            item.calculated = price.calculated ? price.calculated : 0;
            item.max = price.max;
            item.mean = price.mean;
            item.mode = price.mode;
            item.min = price.min;
            item.median = price.median;
        }
        return item;
    }
}

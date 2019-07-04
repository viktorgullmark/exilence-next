import { PoeWatchCombinedPriceItemData } from "../interfaces/poe-watch/poe-watch-combined-price-item-data.interface";
import { ExternalPrice } from "../interfaces/external-price.interface";

export class PriceHelper {
    public static getExternalPriceFromWatchItem(item: PoeWatchCombinedPriceItemData): ExternalPrice {
        return {
            name: item.name,
            max: item.max,
            mean: item.mean,
            median: item.median,
            min: item.min,
            mode: item.mode
        } as ExternalPrice;
    }
}

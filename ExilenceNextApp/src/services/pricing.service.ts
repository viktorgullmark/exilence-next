import { stores } from '..';
import { IPricedItem } from '../interfaces/priced-item.interface';
import { IExternalPrice } from '../interfaces/external-price.interface';

export const pricingService = {
  priceItem
};

function priceItem(item: IPricedItem, prices: IExternalPrice[]) {
  let price: IExternalPrice | undefined;

  if (item.name === 'Chaos Orb') {
    price = {
      max: 1,
      min: 1,
      median: 1,
      mean: 1,
      calculated: 1,
      name: item.name,
      icon: item.icon
    };
  } else {
    switch (item.frameType) {
      case 0: // normal
      case 1: // magic
      case 2: // rare
        if (item.name.indexOf(' Map') > -1) {
          price = prices.find(
            p =>
              (p.name === item.name || item.name.indexOf(p.name) > -1) &&
              p.tier === item.tier
          );
        } else if (item.ilvl > 0) {
          if (item.ilvl > 86) {
            item.ilvl = 86;
          }
          price = prices.find(
            p =>
              p.baseType === item.typeLine &&
              p.level === item.ilvl &&
              p.variant === item.variant
          );
        } else {
          // other (e.g fragments, scrabs)
          price = prices.find(p => p.name === item.name);
        }
        break;
      case 3: // unique
        price = prices.find(
          p =>
            p.name === item.name &&
            p.links === item.links &&
            p.frameType === 3 &&
            p.corrupted === item.corrupted &&
            p.quality === item.quality &&
            (p.variant === item.variant ||
              p.variant === undefined ||
              p.variant === null)
        );
        break;
      case 4: // gem
        price = prices.find(
          p =>
            p.name === item.name &&
            p.level === item.level &&
            p.corrupted === item.corrupted &&
            p.quality === item.quality
        );
        break;
      case 5: // currency
        price = prices.find(p => p.name === item.name);
        break;
      case 6: // divination card
        price = prices.find(
          p => p.name === item.name && p.icon.indexOf('Divination') > -1
        );
        break;
      case 8: // prophecy
        price = prices.find(
          p => p.name === item.name && p.icon.indexOf('Prophecy') > -1
        );
        break;
      case 9: // relic
        price = prices.find(p => p.name === item.name);
        break;
      default:
        price = prices.find(p => p.name === item.name);
    }
  }

  return {
    ...item,
    ...price,
    calculated:
      item.stackSize * (price && price.calculated ? price.calculated : 1)
  };
}

import { IExternalPrice } from '../interfaces/external-price.interface';
import { IPricedItem } from '../interfaces/priced-item.interface';
import { mapPriceToItem } from '../utils/price.utils';

export const pricingService = {
  priceItem,
};

function priceItem(item: IPricedItem, prices: IExternalPrice[]) {
  let price: IExternalPrice | undefined;
  item.total = 0;
  if (item.name === 'Chaos Orb') {
    price = {
      max: 1,
      min: 1,
      median: 1,
      mean: 1,
      calculated: 1,
      name: item.name,
      icon: item.icon,
      count: 0,
      detailsUrl: undefined,
    };
  } else {
    switch (item.frameType) {
      case 0: // normal
      case 1: // magic
      case 2: // rare
        if (item.name.indexOf(' Map') > -1) {
          price = prices.find((p) => p.name === item.name && p.tier === item.tier);
        } else {
          // other (e.g fragments, scrabs)
          price = prices.find((p) => p.name === item.name);
        }
        break;
      case 3: {
        // unique
        const itemPrices = prices.filter(
          (p) =>
            p.name === item.name &&
            ((item.links < 5 && p.links !== undefined && p.links < 5) || p.links === item.links) &&
            p.frameType === 3 &&
            (p.variant === item.variant ||
              p.variant === undefined ||
              p.variant === '' ||
              p.variant === null)
        );

        const qualityPrice = itemPrices.find((ip) => !ip.quality || ip.quality === item.quality);

        if (qualityPrice) {
          price = qualityPrice;
        } else {
          price = itemPrices.find((ip) => ip.quality === 0);
        }

        break;
      }
      case 4: // gem
        price = prices.find(
          (p) =>
            p.name === item.name &&
            p.level === item.level &&
            p.corrupted === item.corrupted &&
            p.quality === item.quality
        );
        break;
      case 5: // currency, including seeds
        if (item.name.indexOf(' Seed') > -1) {
          if (item.ilvl > 0 && item.ilvl < 76) {
            price = prices.find((p) => p.name === item.name && p.ilvl && p.ilvl > 0 && p.ilvl < 76);
          } else {
            price = prices.find(
              (p) => p.name === item.name && p.ilvl && (p.ilvl === 76 || p.ilvl > 76)
            );
          }
        } else {
          price = prices.find((p) => p.name === item.name);
        }
        break;
      case 6: // divination card
        price = prices.find((p) => p.name === item.name && p.icon.indexOf('Inventory') > -1);
        break;
      case 8: // prophecy
        price = prices.find((p) => p.name === item.name && p.icon.indexOf('Prophecy') > -1);
        break;
      case 9: // relic
        price = prices.find((p) => p.name === item.name);
        break;
      default:
        price = prices.find((p) => p.name === item.name);
    }
  }

  let modifiedPrice;
  if (price) {
    const { customPrice, ...rest } = price;
    modifiedPrice = rest;
    modifiedPrice.calculated = customPrice || modifiedPrice.calculated;
    item.total = item.stackSize * (modifiedPrice.calculated ? modifiedPrice.calculated : 1);
    item = mapPriceToItem(item, modifiedPrice);
  }

  const data: IPricedItem = {
    ...item,
    ...modifiedPrice,
    corrupted: item.corrupted,
    icon: item.icon,
  };
  return data;
}

import { IExternalPrice } from './external-price.interface';

export interface ILeaguePriceSource {
  priceSourceUuid: string;
  prices: IExternalPrice[];
}

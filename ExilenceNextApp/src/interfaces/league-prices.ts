import { IExternalPrice } from './external-price.interface';

export interface ILeaguePrices {
  leagueId: string;
  prices: IExternalPrice[];
}

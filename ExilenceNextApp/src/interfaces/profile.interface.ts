import { ICurrency } from './currency.interface';

export interface IProfile {
  uuid?: string;
  name: string;
  activeLeagueId?: string;
  activePriceLeagueId?: string;
  activeCurrency?: ICurrency;
  activeStashTabIds?: string[];
  active?: boolean;
}

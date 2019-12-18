import { ICurrency } from '../currency.interface';

export interface IApiProfile {
    uuid: string;
    name: string;
    activeLeagueId: string;
    activePriceLeagueId: string;
    activeCurrency: ICurrency;
    activeStashTabIds: string[];
}
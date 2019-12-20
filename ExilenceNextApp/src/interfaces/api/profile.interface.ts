import { ICurrency } from '../currency.interface';
import { IApiSnapshot } from './snapshot.interface';

export interface IApiProfile {
    uuid: string;
    name: string;
    activeLeagueId: string;
    activePriceLeagueId: string;
    activeCurrency: ICurrency;
    activeStashTabIds: string[];
    snapshots: IApiSnapshot[];
}
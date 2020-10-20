import { ICurrency } from '../currency.interface';
import { IApiSnapshot } from './api-snapshot.interface';

export interface IApiProfile {
  uuid: string;
  name: string;
  activeLeagueId: string;
  activePriceLeagueId: string;
  activeCharacterName: string;
  activeCurrency: ICurrency;
  activeStashTabIds: string[];
  snapshots: IApiSnapshot[];
  active: boolean;
  includeEquipment: boolean;
  includeInventory: boolean;
}

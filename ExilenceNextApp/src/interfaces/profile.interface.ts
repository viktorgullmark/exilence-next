import { Session } from '../store/domains/session';
import { ICurrency } from './currency.interface';

export interface IProfile {
  uuid?: string;
  name: string;
  session?: Session;
  activeLeagueId?: string;
  activePriceLeagueId?: string;
  activeCurrency?: ICurrency;
  activeStashTabIds?: string[];
  activeCharacterName?: string;
  active?: boolean;
  includeEquipment?: boolean;
  includeInventory?: boolean;
}

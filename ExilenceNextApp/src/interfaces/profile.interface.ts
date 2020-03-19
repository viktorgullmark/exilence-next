import { ICurrency } from './currency.interface';

export interface IProfile {
  uuid?: string;
  name: string;
  activeLeagueId?: string;
  activePriceLeagueId?: string;
  activeCurrency?: ICurrency;
  activeStashTabIds?: string[];
  activeCharacterName?: string;
  active?: boolean;
  includeEquipment?: boolean;
  includeInventory?: boolean;
}

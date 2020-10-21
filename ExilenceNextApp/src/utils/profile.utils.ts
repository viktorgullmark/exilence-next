import { IApiProfile } from '../interfaces/api/api-profile.interface';
import { Profile } from '../store/domains/profile';

export function mapProfileToApiProfile(p: Profile) {
  return {
    uuid: p.uuid,
    name: p.name,
    activeLeagueId: p.activeLeagueId,
    activePriceLeagueId: p.activePriceLeagueId,
    activeCurrency: p.activeCurrency,
    activeStashTabIds: p.activeStashTabIds,
    snapshots: [],
    active: p.active,
    activeCharacterName: p.activeCharacterName,
    includeEquipment: p.includeEquipment,
    includeInventory: p.includeInventory,
  } as IApiProfile;
}

export const generateProfileName = () => {
  const prefixes = [
    'Divine',
    'Majestic',
    'Strong',
    'Exalted',
    'Swift',
    'Rich',
    'Humble',
    'Fine',
    'Nice',
    'Fiery',
  ];
  const suffixes = [
    'Exile',
    'Slayer',
    'Assassin',
    'Duelist',
    'Witch',
    'Trader',
    'Farmer',
    'Grinder',
    'Templar',
    'Merchant',
    'Flipper',
    'Stash',
    'Collection',
  ];

  return (
    prefixes[Math.floor(Math.random() * prefixes.length)] +
    ' ' +
    suffixes[Math.floor(Math.random() * suffixes.length)]
  );
};

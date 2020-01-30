import { IApiProfile } from '../interfaces/api/api-profile.interface';
import { Profile } from '../store/domains/profile';

export function mapProfileToApiProfile(p: Profile) {
  return <IApiProfile>{
    uuid: p.uuid,
    name: p.name,
    activeLeagueId: p.activeLeagueId,
    activePriceLeagueId: p.activePriceLeagueId,
    activeCurrency: p.activeCurrency,
    activeStashTabIds: p.activeStashTabIds,
    snapshots: [],
    active: p.active
  };
}

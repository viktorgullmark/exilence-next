import { IApiProfile } from '../interfaces/api/profile.interface';
import { Profile } from '../store/domains/profile';

export class ProfileUtils {
  public static mapProfileToApiProfile(p: Profile) {
    return <IApiProfile>{ 
      uuid: p.uuid,
      name: p.name,
      activeLeagueId: p.activeLeagueId,
      activePriceLeagueId: p.activePriceLeagueId,
      activeCurrency: p.activeCurrency,
      activeStashTabIds: p.activeStashTabIds
    }
  }
}

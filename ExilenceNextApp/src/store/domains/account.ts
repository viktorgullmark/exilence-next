import { action, computed, observable } from 'mobx';
import { persist } from 'mobx-persist';
import uuid from 'uuid';

import { IAccount } from '../../interfaces/account.interface';
import { ICharacter } from '../../interfaces/character.interface';
import { ILeague } from '../../interfaces/league.interface';
import { AccountLeague } from './account-league';
import { Profile } from './profile';
import { IProfile } from './../../interfaces/profile.interface';
import { League } from './league';

export class Account implements IAccount {
  @persist uuid: string = uuid.v4();
  @persist name: string = '';
  @persist @observable sessionId: string = '';

  @persist('list', AccountLeague) @observable accountLeagues: AccountLeague[] = [];
  @persist('list', Profile) @observable profiles: Profile[] = [
    new Profile({ name: 'profile 1' }),
    new Profile({ name: 'profile 2' })
  ];

  @persist @observable activeProfileUuid: string = '';

  constructor(obj?: IAccount) {
    Object.assign(this, obj);
  }

  @computed
  get activeLeague() {
    const league = this.accountLeagues.find(
      l => l.uuid === this.activeProfile.activeLeagueUuid
    );
    return league ? league : new AccountLeague();
  }

  @computed
  get activePriceLeague() {
    const league = this.accountLeagues.find(
      l => l.uuid === this.activeProfile.activePriceLeagueUuid
    );
    return league ? league : new AccountLeague();
  }

  @computed
  get activeProfile() {
    const profile = this.profiles.find(p => p.uuid === this.activeProfileUuid);
    return profile ? profile : new Profile();
  }

  @action
  setActiveProfile(uuid: string) {
    this.activeProfileUuid = uuid;
  }

  @action
  addAccountLeagues(leagues: League[], characters: ICharacter[]) {
    this.accountLeagues = leagues.map(l => {
      const accLeague = new AccountLeague();
      accLeague.uuid = l.uuid;
      accLeague.updateCharacters(characters.filter(c => c.league === l.id))
      return accLeague;
    });
  }

  @action
  setSessionId(sessionId: string) {
    this.sessionId = sessionId;
  }

  @action
  createProfile(profile: IProfile) {
    const created = new Profile(profile);
    this.profiles.push(created);
  }
}

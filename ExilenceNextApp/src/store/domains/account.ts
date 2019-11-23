import { action, computed, observable } from 'mobx';
import { persist } from 'mobx-persist';
import uuid from 'uuid';
import { IAccount } from '../../interfaces/account.interface';
import { ICharacter } from '../../interfaces/character.interface';
import { stores } from './../../index';
import { IProfile } from './../../interfaces/profile.interface';
import { AccountLeague } from './account-league';
import { League } from './league';
import { Profile } from './profile';

export class Account implements IAccount {
  @persist uuid: string = uuid.v4();
  @persist name: string = '';
  @persist @observable sessionId: string = '';

  @persist('list', AccountLeague)
  @observable
  accountLeagues: AccountLeague[] = [];
  @persist('list', Profile) @observable profiles: Profile[] = [];

  @persist @observable activeProfileUuid: string = '';

  constructor(obj?: IAccount) {
    Object.assign(this, obj);
  }

  @computed
  get activeLeague() {
    const league = stores.leagueStore.leagues.find(
      l => l.id === this.activeProfile.activeLeagueId
    );
    return league!;
  }

  @computed
  get activePriceLeague() {
    const league = stores.leagueStore.priceLeagues.find(
      l => l.id === this.activeProfile.activePriceLeagueId
    );
    return league!;
  }

  @computed
  get activeProfile() {
    const profile = this.profiles.find(p => p.uuid === this.activeProfileUuid);
    return profile ? profile : new Profile();
  }

  @action
  setActiveProfile(uuid: string) {
    stores.uiStateStore.changeItemTablePage(0);
    this.activeProfileUuid = uuid;
  }

  @action
  mapAccountLeagues(
    leagues: League[],
    characters: ICharacter[],
    priceLeagues: League[]
  ) {
    this.accountLeagues = [];
    const mappedLeagues: AccountLeague[] = [];

    leagues.forEach(l => {
      const accLeague = new AccountLeague();
      accLeague.leagueId = l.id;
      accLeague.updateCharacters(characters.filter(c => c.league === l.id));
      if (accLeague.characters.length > 0) {
        mappedLeagues.push(accLeague);
      }
    });

    if (this.profiles.length === 0) {
      this.profiles.push(
        new Profile({
          name: 'profile 1',
          activeLeagueId: mappedLeagues[0]!.leagueId,
          activePriceLeagueId: priceLeagues[0].id
        })
      );
      this.setActiveProfile(this.profiles[0].uuid);
    }

    if (mappedLeagues.length === 0) {
      throw Error('error:no_leagues_with_characters');
    }

    this.accountLeagues = mappedLeagues;
  }

  @action
  setSessionId(sessionId: string) {
    this.sessionId = sessionId;
  }

  @action
  createProfile(profile: IProfile) {
    const created = new Profile(profile);
    this.profiles.push(created);
    this.setActiveProfile(created.uuid);
  }

  @action
  getAllStashTabs() {
    this.accountLeagues.forEach(l => {
      l.getStashTabs();
    })
  }
}

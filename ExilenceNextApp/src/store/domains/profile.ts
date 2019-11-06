import { action, observable } from 'mobx';
import { persist } from 'mobx-persist';
import uuid from 'uuid';
import { IProfile } from '../../interfaces/profile.interface';

export class Profile {
  @persist uuid: string = uuid.v4();
  @persist name: string = '';

  @persist @observable activeLeagueUuid: string = '';
  @persist @observable activePriceLeagueUuid: string = '';

  constructor(obj?: IProfile) {
    Object.assign(this, obj);
  }

  @action
  setActiveLeague(uuid: string) {
    this.activeLeagueUuid = uuid;
  }

  @action
  setActivePriceLeague(uuid: string) {
    this.activePriceLeagueUuid = uuid;
  }
}

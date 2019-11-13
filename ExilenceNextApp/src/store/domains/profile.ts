import { action, observable } from "mobx";
import { persist } from "mobx-persist";
import uuid from "uuid";
import { IProfile } from "../../interfaces/profile.interface";
import { Snapshot } from "./snapshot";
import { fromStream } from "mobx-utils";
import { externalService } from "./../../services/external.service";
import { stores } from "./../../index";
import { map } from 'rxjs/operators';
import { of } from 'rxjs';

export class Profile {
  @persist uuid: string = uuid.v4();

  @persist name: string = "";
  @persist @observable activeLeagueUuid: string = "";
  @persist @observable activePriceLeagueUuid: string = "";
  @persist("list") @observable activeStashTabIds: string[] = [];

  @persist("list", Snapshot) @observable snapshots: Snapshot[] = [];

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

  @action
  setActiveStashTabs(stashTabIds: string[]) {
    console.log("should select", stashTabIds);
    this.activeStashTabIds = stashTabIds;
  }

  @action
  editProfile(profile: IProfile) {
    Object.assign(this, profile);
  }

  @action snapshot() {
    // 1. fetch items for tabs
    this.getItems();
    // 2. price items and save in stashTabSnapshot
  }

  @action getItems() {
    const accountLeague = stores.accountStore.getSelectedAccount.accountLeagues.find(
      al => al.uuid === this.activeLeagueUuid
    );

    const league = stores.leagueStore.leagues.find(
      l => l.uuid === this.activeLeagueUuid
    );

    if (!accountLeague || !league) {
      throw Error("error:no_matching_league");
    }

    fromStream(
      externalService.getItemsForTabs(
        accountLeague.stashtabs,
        stores.accountStore.getSelectedAccount.name,
        league.id
      ).pipe(map(stashTabsWithItems => {
        stashTabsWithItems.map(stashTabWithItems => {
          console.log('items:', stashTabWithItems.items);
        })
      }))
    );
  }

  @action getItemsSuccess() {}

  @action getItemsFail() {}

  @action priceItems() {}

  @action priceItemsSuccess() {}

  @action priceItemsError() {}
}

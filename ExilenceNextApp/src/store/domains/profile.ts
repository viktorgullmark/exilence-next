import { action, observable, reaction } from 'mobx';
import { persist } from 'mobx-persist';
import { fromStream } from 'mobx-utils';
import { map, catchError, mergeMap } from 'rxjs/operators';
import uuid from 'uuid';
import { ItemHelper } from '../../helpers/item.helper';
import { IProfile } from '../../interfaces/profile.interface';
import { stores } from './../../index';
import { externalService } from './../../services/external.service';
import { Snapshot } from './snapshot';
import { IStashTabSnapshot } from '../../interfaces/stash-tab-snapshot.interface';
import { IPricedItem } from '../../interfaces/priced-item.interface';
import { IExternalPrice } from '../../interfaces/external-price.interface';
import { of } from 'rxjs';
import { ISnapshot } from '../../interfaces/snapshot.interface';
import { pricingService } from '../../services/pricing.service';
import { NotificationType } from '../../enums/notification-type.enum';

export class Profile {
  @persist uuid: string = uuid.v4();

  @persist name: string = '';
  @persist @observable activeLeagueUuid: string = '';
  @persist @observable activePriceLeagueUuid: string = '';
  @persist('list') @observable activeStashTabIds: string[] = [];

  @persist('list', Snapshot) @observable snapshots: Snapshot[] = [];

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
    this.activeStashTabIds = stashTabIds;
  }

  @action
  editProfile(profile: IProfile) {
    Object.assign(this, profile);
  }

  @action snapshot() {
    this.getItems();
  }

  @action snapshotSuccess() {
    stores.notificationStore.createNotification(
      'snapshot',
      NotificationType.Success
    );
  }

  @action snapshotFail() {
    stores.notificationStore.createNotification(
      'snapshot',
      NotificationType.Error
    );
  }

  @action getItems() {
    const accountLeague = stores.accountStore.getSelectedAccount.accountLeagues.find(
      al => al.uuid === this.activeLeagueUuid
    );

    const league = stores.leagueStore.leagues.find(
      l => l.uuid === this.activeLeagueUuid
    );

    if (!accountLeague || !league) {
      throw Error('error:no_matching_league');
    }

    const selectedStashTabs = accountLeague.stashtabs.filter(
      st => this.activeStashTabIds.find(ast => ast === st.id) !== undefined
    );
    fromStream(
      externalService
        .getItemsForTabs(
          selectedStashTabs,
          stores.accountStore.getSelectedAccount.name,
          league.id
        )
        .pipe(
          map(stashTabsWithItems => {
            stashTabsWithItems.map(stashTabWithItems => {
              stashTabWithItems.items = ItemHelper.mergeItemStacks(
                stashTabWithItems.items
              );
              return stashTabWithItems;
            });
            return this.getItemsSuccess(stashTabsWithItems);
          }),
          catchError((e: Error) => of(this.getItemsFail(e)))
        )
    );
  }

  @action getItemsSuccess(stashTabsWithItems: IStashTabSnapshot[]) {
    stores.notificationStore.createNotification(
      'get_items',
      NotificationType.Success
    );
    this.priceItemsForStashTabs(stashTabsWithItems);
  }

  @action getItemsFail(e: Error) {
    stores.notificationStore.createNotification(
      'get_items',
      NotificationType.Error
    );
  }

  @action
  priceItemsForStashTabs(stashTabsWithItems: IStashTabSnapshot[]) {
    const activePriceDetails = stores.priceStore.leaguePriceDetails.find(
      l =>
        l.leagueUuid ===
        stores.accountStore.getSelectedAccount.activePriceLeague.uuid
    );

    if (!activePriceDetails) {
      throw Error('error:no_prices_received_for_league');
    }

    const pricedStashTabs = stashTabsWithItems.map(
      (stashTabWithItems: IStashTabSnapshot) => {
        stashTabWithItems.items = stashTabWithItems.items.map(
          (item: IPricedItem) => {
            return pricingService.priceItem(
              item,
              // todo: add support for multiple sources
              activePriceDetails.leaguePriceSources[0].prices
            );
          }
        );

        stashTabWithItems.value = stashTabWithItems.items
          .map(ts => ts.calculated)
          .reduce((a, b) => a + b, 0);

        return stashTabWithItems;
      }
    );

    return this.priceItemsForStashTabsSuccess(pricedStashTabs);
  }

  @action
  priceItemsForStashTabsSuccess(pricedStashTabs: IStashTabSnapshot[]) {
    stores.notificationStore.createNotification(
      'price_items_for_stash_tabs',
      NotificationType.Success
    );
    this.saveSnapshot(pricedStashTabs);
  }

  @action
  priceItemsForStashTabsFail() {
    stores.notificationStore.createNotification(
      'price_items_for_stash_tabs',
      NotificationType.Error
    );
    this.snapshotFail();
  }

  @action
  saveSnapshot(pricedStashTabs: IStashTabSnapshot[]) {
    const snapshot: ISnapshot = {
      stashTabSnapshots: pricedStashTabs
    };

    this.snapshots.unshift(new Snapshot(snapshot));

    // clear items from previous snapshot
    if (this.snapshots.length > 1) {
      this.snapshots[1].stashTabSnapshots.forEach(stss => {
        stss.items = [];
      });
    }
    this.snapshotSuccess();
  }
}

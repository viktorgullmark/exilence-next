import { action, observable, reaction, computed } from 'mobx';
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
import { ICurrency } from '../../interfaces/currency.interface';

export class Profile {
  @persist uuid: string = uuid.v4();

  @persist name: string = '';
  @persist @observable activeLeagueId: string = '';
  @persist @observable activePriceLeagueId: string = '';
  @persist('object') @observable activeCurrency: ICurrency = { name: 'chaos', short: 'c' };

  @persist('list') @observable activeStashTabIds: string[] = [];

  @persist('list', Snapshot) @observable snapshots: Snapshot[] = [];

  @observable isSnapshotting: boolean = false;

  constructor(obj?: IProfile) {
    Object.assign(this, obj);
  }

  @computed
  get readyToSnapshot() {
    const account = stores.accountStore.getSelectedAccount;
    const league = account.accountLeagues.find(
      al => al.leagueId === account.activeLeague.id
    );
    return (
      league &&
      league.stashtabs.length > 0 &&
      !stores.priceStore.isUpdatingPrices &&
      stores.uiStateStore.validated &&
      !this.isSnapshotting
    );
  }

  @computed
  get tableItems() {
    if (this.snapshots.length === 0) {
      return [];
    }
    return ItemHelper.mergeItemStacks(
      this.snapshots[0].stashTabSnapshots.flatMap(sts =>
        sts.items.filter(i => i.calculated > 0)
      )
    );
  }

  @computed
  get latestSnapshotValue() {
    if (this.snapshots.length === 0) {
      return 0;
    }
   
    const values = this.snapshots[0].stashTabSnapshots
      .flatMap(sts => sts.value).reduce((a, b) => a + b, 0);

    return +values.toFixed(2);
  }

  @computed
  get latestSnapshotItemCount() {
    if (this.snapshots.length === 0) {
      return 0;
    }
    return this.snapshots.flatMap(s =>
      s.stashTabSnapshots.flatMap(sts => sts.items)
    ).length;
  }

  @action
  setActiveLeague(id: string) {
    this.activeLeagueId = id;
  }

  @action
  setActivePriceLeague(id: string) {
    this.activePriceLeagueId = id;
  }

  @action
  setActiveStashTabs(stashTabIds: string[]) {
    this.activeStashTabIds = stashTabIds;
  }

  @action
  editProfile(profile: IProfile) {
    Object.assign(this, profile);
  }

  @action
  setIsSnapshotting(snapshotting: boolean = true) {
    this.isSnapshotting = snapshotting;
  }

  @action snapshot() {
    this.setIsSnapshotting();
    this.getItems();
  }

  @action snapshotSuccess() {
    stores.notificationStore.createNotification(
      'snapshot',
      NotificationType.Success
    );
    this.setIsSnapshotting(false);
  }

  @action snapshotFail() {
    stores.notificationStore.createNotification(
      'snapshot',
      NotificationType.Error
    );
    this.setIsSnapshotting(false);
  }

  @action getItems() {
    const accountLeague = stores.accountStore.getSelectedAccount.accountLeagues.find(
      al => al.leagueId === this.activeLeagueId
    );

    const league = stores.leagueStore.leagues.find(
      l => l.id === this.activeLeagueId
    );

    // todo: catch these errors
    if (!accountLeague || !league) {
      throw Error('error:no_matching_league');
    }

    const selectedStashTabs = accountLeague.stashtabs.filter(
      st => this.activeStashTabIds.find(ast => ast === st.id) !== undefined
    );

    if (selectedStashTabs.length === 0) {
      throw Error('error:no_stash_tabs_for_profile');
    }

    fromStream(
      externalService
        .getItemsForTabs(
          selectedStashTabs,
          stores.accountStore.getSelectedAccount.name,
          league.id
        )
        .pipe(
          map(stashTabsWithItems => {
            return stashTabsWithItems.map(stashTabWithItems => {
              stashTabWithItems.items = ItemHelper.mergeItemStacks(
                stashTabWithItems.items
              );
              return stashTabWithItems;
            });
          }),
          mergeMap(stashTabsWithItems =>
            of(this.getItemsSuccess(stashTabsWithItems))
          ),
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
    console.log('price details:', stores.priceStore.leaguePriceDetails);
    const activePriceDetails = stores.priceStore.leaguePriceDetails.find(
      l =>
        l.leagueId ===
        stores.accountStore.getSelectedAccount.activePriceLeague.id
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
          .map(ts => ts.total)
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

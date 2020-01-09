import { AxiosError } from 'axios';
import { action, computed, observable } from 'mobx';
import { persist } from 'mobx-persist';
import { fromStream } from 'mobx-utils';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import uuid from 'uuid';
import { ICurrency } from '../../interfaces/currency.interface';
import { IPricedItem } from '../../interfaces/priced-item.interface';
import { IProfile } from '../../interfaces/profile.interface';
import { ISnapshot } from '../../interfaces/snapshot.interface';
import { IStashTabSnapshot } from '../../interfaces/stash-tab-snapshot.interface';
import { pricingService } from '../../services/pricing.service';
import { ItemUtils } from '../../utils/item.utils';
import { PriceUtils } from '../../utils/price.utils';
import { stores, visitor } from './../../index';
import { externalService } from './../../services/external.service';
import { Snapshot } from './snapshot';
import { SnapshotUtils } from '../../utils/snapshot.utils';
import { ProfileUtils } from '../../utils/profile.utils';
import { StashTabSnapshot } from './stashtab-snapshot';

export class Profile {
  @persist uuid: string = uuid.v4();

  @persist name: string = '';
  @persist @observable activeLeagueId: string = '';
  @persist @observable activePriceLeagueId: string = '';
  @persist('object') @observable activeCurrency: ICurrency = {
    name: 'chaos',
    short: 'c'
  };

  @persist('list') @observable activeStashTabIds: string[] = [];

  @persist('list', Snapshot) @observable snapshots: Snapshot[] = [];

  @observable isSnapshotting: boolean = false;

  @observable shouldSetStashTabs: boolean = false;

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
  get items() {
    if (this.snapshots.length === 0) {
      return [];
    }
    return SnapshotUtils.filterItems([
      SnapshotUtils.mapSnapshotToApiSnapshot(this.snapshots[0])
    ]);
  }

  @computed
  get netWorthValue() {
    if (this.snapshots.length === 0) {
      return 0;
    }
    return SnapshotUtils.calculateNetWorth([
      SnapshotUtils.mapSnapshotToApiSnapshot(this.snapshots[0])
    ]);
  }

  @computed
  get itemCount() {
    if (this.snapshots.length === 0) {
      return 0;
    }
    return SnapshotUtils.getItemCount([
      SnapshotUtils.mapSnapshotToApiSnapshot(this.snapshots[0])
    ]);
  }

  @action
  setActiveLeague(id: string) {
    this.activeLeagueId = id;
  }

  @action
  clearSnapshots() {
    this.snapshots = [];
    stores.signalrStore.removeAllSnapshots(this.uuid);
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
    visitor!.event('Profile', 'Edit profile').send();

    Object.assign(this, profile);
    stores.signalrStore.updateProfile(
      ProfileUtils.mapProfileToApiProfile(this)
    );
  }

  @action
  setIsSnapshotting(snapshotting: boolean = true) {
    this.isSnapshotting = snapshotting;
  }

  @action snapshot() {
    visitor!.event('Profile', 'Triggered snapshot').send();

    this.setIsSnapshotting();
    this.getItems();
  }

  @action snapshotSuccess() {
    stores.notificationStore.createNotification('snapshot', 'success');
    this.setIsSnapshotting(false);
  }

  @action snapshotFail(e?: AxiosError | Error) {
    stores.notificationStore.createNotification('snapshot', 'error', true, e);
    this.setIsSnapshotting(false);
  }

  @action getItems() {
    const accountLeague = stores.accountStore.getSelectedAccount.accountLeagues.find(
      al => al.leagueId === this.activeLeagueId
    );

    const league = stores.leagueStore.leagues.find(
      l => l.id === this.activeLeagueId
    );

    if (!accountLeague || !league) {
      return this.getItemsFail(
        new Error('no_matching_league'),
        this.activeLeagueId
      );
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
            return stashTabsWithItems.map(stashTabWithItems => {
              stashTabWithItems.pricedItems = ItemUtils.mergeItemStacks(
                stashTabWithItems.pricedItems
              );
              return stashTabWithItems;
            });
          }),
          mergeMap(stashTabsWithItems =>
            of(this.getItemsSuccess(stashTabsWithItems, league.id))
          ),
          catchError((e: AxiosError) => of(this.getItemsFail(e, league.id)))
        )
    );
  }

  @action getItemsSuccess(
    stashTabsWithItems: IStashTabSnapshot[],
    leagueId: string
  ) {
    // todo: clean up, must be possible to write this in a nicer manner (perhaps a joint function for both error/success?)
    stores.notificationStore.createNotification(
      'get_items',
      'success',
      undefined,
      undefined,
      leagueId
    );
    this.priceItemsForStashTabs(stashTabsWithItems);
  }

  @action getItemsFail(e: AxiosError | Error, leagueId: string) {
    stores.notificationStore.createNotification(
      'get_items',
      'error',
      true,
      e,
      leagueId
    );
    this.snapshotFail();
  }

  @action
  priceItemsForStashTabs(stashTabsWithItems: IStashTabSnapshot[]) {
    const activePriceDetails = stores.priceStore.leaguePriceDetails.find(
      l =>
        l.leagueId ===
        stores.accountStore.getSelectedAccount.activePriceLeague.id
    );

    if (!activePriceDetails) {
      return this.priceItemsForStashTabsFail(
        new Error('no_prices_received_for_league')
      );
    }

    let filteredPrices = activePriceDetails.leaguePriceSources[0].prices.filter(
      p => p.count > 10
    );
    filteredPrices = PriceUtils.excludeLegacyMaps(filteredPrices);

    const pricedStashTabs = stashTabsWithItems.map(
      (stashTabWithItems: IStashTabSnapshot) => {
        stashTabWithItems.pricedItems = stashTabWithItems.pricedItems.map(
          (item: IPricedItem) => {
            return pricingService.priceItem(
              item,
              // todo: add support for multiple sources
              filteredPrices
            );
          }
        );

        stashTabWithItems.value = stashTabWithItems.pricedItems
          .map(ts => ts.total)
          .reduce((a, b) => a + b, 0);

        return stashTabWithItems;
      }
    );

    return this.priceItemsForStashTabsSuccess(pricedStashTabs);
  }

  @action
  priceItemsForStashTabsSuccess(pricedStashTabs: IStashTabSnapshot[]) {
    stores.notificationStore.createNotification('price_stash_items', 'success');
    this.saveSnapshot(pricedStashTabs);
  }

  @action
  priceItemsForStashTabsFail(e: AxiosError | Error) {
    stores.notificationStore.createNotification(
      'price_stash_items',
      'error',
      true,
      e
    );
    this.snapshotFail();
  }

  @action
  saveSnapshot(pricedStashTabs: IStashTabSnapshot[]) {
    const snapshot: ISnapshot = {
      stashTabSnapshots: pricedStashTabs.map(p => new StashTabSnapshot(p))
    };

    const snapshotToAdd = new Snapshot(snapshot);
    this.snapshots.unshift(snapshotToAdd);
    this.snapshots = this.snapshots.slice(0, 100);

    const activeAccountLeague = stores.accountStore.getSelectedAccount.accountLeagues.find(
      al => al.leagueId === this.activeLeagueId
    );

    if (activeAccountLeague) {
      const apiSnapshot = SnapshotUtils.mapSnapshotToApiSnapshot(
        snapshotToAdd,
        activeAccountLeague.stashtabs
      );
      const apiItems = SnapshotUtils.mapSnapshotsToStashTabPricedItems(
        snapshotToAdd,
        activeAccountLeague.stashtabs
      );

      fromStream(
        stores.signalrStore.createSnapshot(apiSnapshot, this.uuid).pipe(
          switchMap(() => {
            return of(
              stores.signalrStore.uploadItems(
                apiItems,
                this.uuid,
                apiSnapshot.uuid
              )
            );
          })
        )
      );
    }

    // clear items from previous snapshot
    if (this.snapshots.length > 1) {
      this.snapshots[1].stashTabSnapshots.forEach(stss => {
        stss.pricedItems = [];
      });
    }

    if (stores.signalrStore.activeGroup) {
      stores.signalrStore.addOwnSnapshotToActiveGroup(this.snapshots[0]);
    }
    this.snapshotSuccess();
  }
}

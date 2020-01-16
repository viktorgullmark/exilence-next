import { AxiosError } from 'axios';
import { action, computed, observable, runInAction } from 'mobx';
import { persist } from 'mobx-persist';
import { fromStream } from 'mobx-utils';
import { of } from 'rxjs';
import {
  catchError,
  map,
  mergeMap,
  switchMap,
  concatMap,
  flatMap
} from 'rxjs/operators';
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
import { IApiProfile } from '../../interfaces/api/api-profile.interface';
import { IApiSnapshot } from '../../interfaces/api/api-snapshot.interface';
import { IApiStashTabPricedItem } from '../../interfaces/api/api-stashtab-priceditem.interface';

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

  @persist @observable active: boolean = false;

  constructor(obj?: IProfile) {
    Object.assign(this, obj);
  }

  @computed
  get readyToSnapshot() {
    const account = stores.accountStore.getSelectedAccount;
    const league = account.accountLeagues.find(
      al => account.activeLeague && al.leagueId === account.activeLeague.id
    );
    return (
      league &&
      league.stashtabs.length > 0 &&
      !stores.priceStore.isUpdatingPrices &&
      stores.uiStateStore.validated &&
      stores.uiStateStore.initiated &&
      !stores.uiStateStore.isSnapshotting
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
  setActivePriceLeague(id: string) {
    this.activePriceLeagueId = id;
  }

  @action
  setActiveStashTabs(stashTabIds: string[]) {
    this.activeStashTabIds = stashTabIds;
  }

  @action
  updateProfile(profile: IProfile, callback: () => void) {
    visitor!.event('Profile', 'Edit profile').send();

    const apiProfile = ProfileUtils.mapProfileToApiProfile(this);

    fromStream(
      stores.signalrHub
        .invokeEvent<IApiProfile>('EditProfile', apiProfile)
        .pipe(
          map((p: IApiProfile) => {
            runInAction(() => {
              Object.assign(this, profile);
            });
            callback();
            return this.updateProfileSuccess();
          }),
          catchError((e: AxiosError) => of(this.updateProfileFail(e)))
        )
    );
  }

  @action
  updateProfileFail(e: Error) {
    stores.notificationStore.createNotification(
      'update_profile',
      'error',
      false,
      e
    );
  }

  @action
  updateProfileSuccess() {
    stores.notificationStore.createNotification('update_profile', 'success');
  }

  @action snapshot() {
    visitor!.event('Profile', 'Triggered snapshot').send();

    stores.uiStateStore!.setIsSnapshotting(true);
    this.getItems();
  }

  @action snapshotSuccess() {
    stores.notificationStore.createNotification('snapshot', 'success');
    stores.uiStateStore!.setIsSnapshotting(false);
  }

  @action snapshotFail(e?: AxiosError | Error) {
    stores.notificationStore.createNotification('snapshot', 'error', true, e);
    stores.uiStateStore!.setIsSnapshotting(false);
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
          stores.accountStore.getSelectedAccount.name!,
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
      const callback = () => {
        // clear items from previous snapshot
        if (this.snapshots.length > 1) {
          this.snapshots[0].stashTabSnapshots.forEach(stss => {
            stss.pricedItems = [];
          });
        }

        if (stores.signalrStore.activeGroup) {
          stores.signalrStore.addOwnSnapshotToActiveGroup(snapshotToAdd);
        }
        runInAction(() => {
          this.snapshots.unshift(snapshotToAdd);
          this.snapshots = this.snapshots.slice(0, 100);
        });
      };
      fromStream(
        this.sendSnapshot(
          apiSnapshot,
          apiItems,
          this.snapshotSuccess,
          this.snapshotFail,
          callback
        )
      );
    }
  }

  @action
  sendSnapshot(
    snapshot: IApiSnapshot,
    items: IApiStashTabPricedItem[],
    successAction: () => void,
    failAction: (e: AxiosError) => void,
    callback?: () => void
  ) {
    return stores.signalrHub
      .invokeEvent<IApiSnapshot>('AddSnapshot', snapshot, this.uuid)
      .pipe(
        switchMap(() => {
          return stores.signalrStore.uploadItems(
            items,
            this.uuid,
            snapshot.uuid
          );
        }),
        switchMap(() => {
          if (callback) {
            callback();
          }
          return of(successAction());
        }),
        catchError((e: AxiosError) => {
          return of(failAction(e));
        })
      );
  }

  @action
  removeAllSnapshotsSuccess() {
    stores.uiStateStore.setClearingSnapshots(false);
    stores.notificationStore.createNotification(
      'remove_all_snapshots',
      'success'
    );
  }

  @action
  removeAllSnapshots() {
    stores.uiStateStore.setClearingSnapshots(true);
    fromStream(
      stores.signalrHub
        .invokeEvent<string>('RemoveAllSnapshots', this.uuid)
        .pipe(
          map(() => {
            runInAction(() => {
              this.snapshots = [];
            });
            return this.removeAllSnapshotsSuccess();
          }),
          catchError((e: AxiosError) => of(this.removeAllSnapshotFail(e)))
        )
    );
  }

  @action
  removeAllSnapshotFail(e: Error) {
    stores.uiStateStore.setClearingSnapshots(false);
    stores.notificationStore.createNotification(
      'remove_all_snapshots',
      'error',
      false,
      e
    );
  }
}

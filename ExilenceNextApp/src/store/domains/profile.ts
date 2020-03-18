import { AxiosError } from 'axios';
import { action, computed, observable, runInAction } from 'mobx';
import { persist } from 'mobx-persist';
import { fromStream } from 'mobx-utils';
import moment from 'moment';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import uuid from 'uuid';
import { IApiProfile } from '../../interfaces/api/api-profile.interface';
import { IApiSnapshot } from '../../interfaces/api/api-snapshot.interface';
import { IConnectionChartSeries } from '../../interfaces/connection-chart-series.interface';
import { ICurrency } from '../../interfaces/currency.interface';
import { IPricedItem } from '../../interfaces/priced-item.interface';
import { IProfile } from '../../interfaces/profile.interface';
import { ISnapshot } from '../../interfaces/snapshot.interface';
import { IStashTabSnapshot } from '../../interfaces/stash-tab-snapshot.interface';
import { pricingService } from '../../services/pricing.service';
import { mergeItemStacks } from '../../utils/item.utils';
import { excludeLegacyMaps } from '../../utils/price.utils';
import { mapProfileToApiProfile } from '../../utils/profile.utils';
import {
  calculateNetWorth,
  filterItems,
  formatSnapshotsForChart,
  getItemCount,
  getValueForSnapshotsTabs,
  mapSnapshotToApiSnapshot
} from '../../utils/snapshot.utils';
import { visitor, rootStore } from './../../index';
import { externalService } from './../../services/external.service';
import { Snapshot } from './snapshot';
import { StashTabSnapshot } from './stashtab-snapshot';

export class Profile {
  @persist uuid: string = uuid.v4();

  @persist name: string = '';
  @persist @observable activeLeagueId: string = '';
  @persist @observable activePriceLeagueId: string = '';
  @persist @observable activeCharacterName: string = '';
  @persist('object') @observable activeCurrency: ICurrency = {
    name: 'chaos',
    short: 'c'
  };

  @persist('list') @observable activeStashTabIds: string[] = [];

  @persist('list', Snapshot) @observable snapshots: Snapshot[] = [];

  @persist @observable active: boolean = false;
  @persist @observable includeEquipment: boolean = false;
  @persist @observable includeInventory: boolean = false;

  constructor(obj?: IProfile) {
    Object.assign(this, obj);
  }

  @computed
  get readyToSnapshot() {
    const account = rootStore.accountStore.getSelectedAccount;
    const league = account.accountLeagues.find(
      al => account.activeLeague && al.leagueId === account.activeLeague.id
    );

    return (
      league &&
      league.stashtabs.length > 0 &&
      !rootStore.priceStore.isUpdatingPrices &&
      rootStore.uiStateStore.validated &&
      rootStore.uiStateStore.initiated &&
      !rootStore.uiStateStore.isSnapshotting
    );
  }

  @computed
  get items() {
    if (this.snapshots.length === 0) {
      return [];
    }
    return filterItems([mapSnapshotToApiSnapshot(this.snapshots[0])]);
  }

  @computed
  get netWorthValue() {
    if (this.snapshots.length === 0) {
      return 0;
    }
    return calculateNetWorth([mapSnapshotToApiSnapshot(this.snapshots[0])]);
  }

  @computed
  get lastSnapshotChange() {
    if (this.snapshots.length < 2) {
      return 0;
    }
    const lastSnapshotNetWorth = getValueForSnapshotsTabs([
      mapSnapshotToApiSnapshot(this.snapshots[0])
    ]);
    const previousSnapshotNetWorth = getValueForSnapshotsTabs([
      mapSnapshotToApiSnapshot(this.snapshots[1])
    ]);

    return lastSnapshotNetWorth - previousSnapshotNetWorth;
  }

  @computed
  get chartData() {
    if (this.snapshots.length === 0) {
      return undefined;
    }

    const connectionSeries: IConnectionChartSeries = {
      seriesName: this.name,
      series: formatSnapshotsForChart(
        this.snapshots.map(s => mapSnapshotToApiSnapshot(s))
      )
    };

    return connectionSeries;
  }

  @computed
  get itemCount() {
    if (this.snapshots.length === 0) {
      return 0;
    }
    return getItemCount([mapSnapshotToApiSnapshot(this.snapshots[0])]);
  }

  @computed
  get income() {
    const hours = 1;
    const hoursAgo = moment()
      .utc()
      .subtract(hours, 'hours');
    const snapshots = this.snapshots.filter(s =>
      moment(s.created)
        .utc()
        .isAfter(hoursAgo)
    );

    if (snapshots.length > 1) {
      const lastSnapshot = mapSnapshotToApiSnapshot(snapshots[0]);
      const firstSnapshot = mapSnapshotToApiSnapshot(
        snapshots[snapshots.length - 1]
      );
      const incomePerHour =
        (calculateNetWorth([lastSnapshot]) -
          calculateNetWorth([firstSnapshot])) /
        hours;
      return incomePerHour;
    }

    return 0;
  }

  @computed
  get timeSinceLastSnapshot() {
    if (this.snapshots.length === 0) {
      return undefined;
    }
    return moment(this.snapshots[0].created).fromNow();
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
  setActiveCharacterName(name: string) {
    this.activeCharacterName = name;
  }

  @action
  setActiveStashTabs(stashTabIds: string[]) {
    this.activeStashTabIds = stashTabIds;
  }

  @action
  updateFromApiProfile(apiProfile: IApiProfile) {
    this.activeLeagueId = apiProfile.activeLeagueId;
    this.activePriceLeagueId = apiProfile.activePriceLeagueId;
    this.activeStashTabIds = apiProfile.activeStashTabIds;
    this.name = apiProfile.name;
  }

  @action
  updateProfile(profile: IProfile, callback: () => void) {
    visitor!.event('Profile', 'Edit profile').send();

    const apiProfile = mapProfileToApiProfile(new Profile(profile));

    fromStream(
      rootStore.signalrHub
        .invokeEvent<IApiProfile>('EditProfile', apiProfile)
        .pipe(
          map((p: IApiProfile) => {
            this.updateFromApiProfile(apiProfile);
            callback();
            return this.updateProfileSuccess();
          }),
          catchError((e: AxiosError) => of(this.updateProfileFail(e)))
        )
    );
  }

  @action
  updateProfileFail(e: Error) {
    rootStore.notificationStore.createNotification(
      'update_profile',
      'error',
      false,
      e
    );
  }

  @action
  updateProfileSuccess() {
    rootStore.notificationStore.createNotification('update_profile', 'success');
  }

  @action snapshot() {
    visitor!.event('Profile', 'Triggered snapshot').send();

    rootStore.uiStateStore!.setIsSnapshotting(true);
    this.getItems();
  }

  @action snapshotSuccess() {
    rootStore.uiStateStore.resetStatusMessage();
    rootStore.notificationStore.createNotification('snapshot', 'success');
    if (rootStore.settingStore.autoSnapshotting) {
      rootStore.accountStore.getSelectedAccount.dequeueSnapshot();
      rootStore.accountStore.getSelectedAccount.queueSnapshot();
    }
    rootStore.uiStateStore!.setIsSnapshotting(false);
    rootStore.uiStateStore!.setTimeSinceLastSnapshotLabel(undefined);
  }

  @action snapshotFail(e?: AxiosError | Error) {
    rootStore.uiStateStore.resetStatusMessage();
    rootStore.notificationStore.createNotification(
      'snapshot',
      'error',
      true,
      e
    );
    if (rootStore.settingStore.autoSnapshotting) {
      rootStore.accountStore.getSelectedAccount.dequeueSnapshot();
      rootStore.accountStore.getSelectedAccount.queueSnapshot();
    }
    rootStore.uiStateStore!.setIsSnapshotting(false);
  }

  @action getItems() {
    const accountLeague = rootStore.accountStore.getSelectedAccount.accountLeagues.find(
      al => al.leagueId === this.activeLeagueId
    );

    const league = rootStore.leagueStore.leagues.find(
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

    rootStore.uiStateStore.setStatusMessage(
      'fetching_stash_tab',
      undefined,
      1,
      selectedStashTabs.length
    );

    fromStream(
      externalService
        .getItemsForTabs(
          selectedStashTabs,
          rootStore.accountStore.getSelectedAccount.name!,
          league.id
        )
        .pipe(
          map(stashTabsWithItems => {
            return stashTabsWithItems.map(stashTabWithItems => {
              stashTabWithItems.pricedItems = mergeItemStacks(
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
    rootStore.notificationStore.createNotification(
      'get_items',
      'success',
      undefined,
      undefined,
      leagueId
    );
    this.priceItemsForStashTabs(stashTabsWithItems);
  }

  @action getItemsFail(e: AxiosError | Error, leagueId: string) {
    rootStore.notificationStore.createNotification(
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
    rootStore.uiStateStore.setStatusMessage('pricing_items');
    const activePriceLeague =
      rootStore.accountStore.getSelectedAccount.activePriceLeague;

    if (!activePriceLeague) {
      return this.priceItemsForStashTabsFail(
        new Error('error:no_active_price_league')
      );
    }

    const activePriceDetails = rootStore.priceStore.leaguePriceDetails.find(
      l => l.leagueId === activePriceLeague.id
    );

    if (!activePriceDetails) {
      return this.priceItemsForStashTabsFail(
        new Error('error:no_prices_received_for_league')
      );
    }

    let prices = activePriceDetails.leaguePriceSources[0].prices;

    if (!rootStore.settingStore.lowConfidencePricing) {
      prices = prices.filter(p => p.count > 10);
    }

    prices = prices.filter(
      p => p.calculated && p.calculated >= rootStore.settingStore.priceTreshold
    );

    prices = excludeLegacyMaps(prices);

    const pricedStashTabs = stashTabsWithItems.map(
      (stashTabWithItems: IStashTabSnapshot) => {
        stashTabWithItems.pricedItems = stashTabWithItems.pricedItems.map(
          (item: IPricedItem) => {
            return pricingService.priceItem(
              item,
              // todo: add support for multiple sources
              prices
            );
          }
        );

        stashTabWithItems.value = stashTabWithItems.pricedItems
          .filter(
            item =>
              item.calculated * item.stackSize >=
              rootStore.settingStore.priceTreshold
          )
          .map(ts => ts.total)
          .reduce((a, b) => a + b, 0);

        return stashTabWithItems;
      }
    );

    return this.priceItemsForStashTabsSuccess(pricedStashTabs);
  }

  @action
  priceItemsForStashTabsSuccess(pricedStashTabs: IStashTabSnapshot[]) {
    rootStore.notificationStore.createNotification(
      'price_stash_items',
      'success'
    );
    this.saveSnapshot(pricedStashTabs);
  }

  @action
  priceItemsForStashTabsFail(e: AxiosError | Error) {
    rootStore.notificationStore.createNotification(
      'price_stash_items',
      'error',
      true,
      e
    );
    this.snapshotFail();
  }

  @action
  saveSnapshot(pricedStashTabs: IStashTabSnapshot[]) {
    rootStore.uiStateStore.setStatusMessage('saving_snapshot');
    const snapshot: ISnapshot = {
      stashTabSnapshots: pricedStashTabs.map(p => new StashTabSnapshot(p))
    };

    const snapshotToAdd = new Snapshot(snapshot);

    const activeAccountLeague = rootStore.accountStore.getSelectedAccount.accountLeagues.find(
      al => al.leagueId === this.activeLeagueId
    );

    if (activeAccountLeague) {
      const apiSnapshot = mapSnapshotToApiSnapshot(
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

        if (rootStore.signalrStore.activeGroup) {
          rootStore.signalrStore.addOwnSnapshotToActiveGroup(snapshotToAdd);
        }
        runInAction(() => {
          this.snapshots.unshift(snapshotToAdd);
          this.snapshots = this.snapshots.slice(0, 1000);
        });
      };
      fromStream(
        this.sendSnapshot(
          apiSnapshot,
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
    successAction: () => void,
    failAction: (e: AxiosError) => void,
    callback?: () => void
  ) {
    return rootStore.signalrHub
      .invokeEvent<IApiSnapshot>('AddSnapshot', snapshot, this.uuid)
      .pipe(
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
    rootStore.uiStateStore.setConfirmClearSnapshotsDialogOpen(false);
    rootStore.uiStateStore.setClearingSnapshots(false);
    rootStore.notificationStore.createNotification(
      'remove_all_snapshots',
      'success'
    );
  }

  @action
  removeAllSnapshots() {
    rootStore.uiStateStore.setClearingSnapshots(true);
    fromStream(
      rootStore.signalrHub
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
    rootStore.uiStateStore.setConfirmClearSnapshotsDialogOpen(false);
    rootStore.uiStateStore.setClearingSnapshots(false);
    rootStore.notificationStore.createNotification(
      'remove_all_snapshots',
      'error',
      false,
      e
    );
  }
}

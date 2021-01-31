import { AxiosError } from 'axios';
import { action, computed, makeObservable, observable, runInAction, toJS } from 'mobx';
import { persist } from 'mobx-persist';
import { fromStream } from 'mobx-utils';
import moment from 'moment';
import { forkJoin, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

import { IApiProfile } from '../../interfaces/api/api-profile.interface';
import { IApiSnapshot } from '../../interfaces/api/api-snapshot.interface';
import { IChartStashTabSnapshot } from '../../interfaces/chart-stash-tab-snapshot.interface';
import { IConnectionChartSeries } from '../../interfaces/connection-chart-series.interface';
import { ICurrency } from '../../interfaces/currency.interface';
import { IPricedItem } from '../../interfaces/priced-item.interface';
import { IProfile } from '../../interfaces/profile.interface';
import { ISnapshot } from '../../interfaces/snapshot.interface';
import { IStashTabSnapshot } from '../../interfaces/stash-tab-snapshot.interface';
import { pricingService } from '../../services/pricing.service';
import { findItem, mapItemsToPricedItems, mergeItemStacks } from '../../utils/item.utils';
import {
  excludeLegacyMaps,
  findPrice,
  findPriceForItem,
  mapPriceToItem,
} from '../../utils/price.utils';
import { mapProfileToApiProfile } from '../../utils/profile.utils';
import {
  calculateNetWorth,
  filterItems,
  formatSnapshotsForChart,
  formatStashTabSnapshotsForChart,
  formatValue,
  getItemCount,
  getValueForSnapshot,
  getValueForSnapshotsTabs,
  mapSnapshotToApiSnapshot,
} from '../../utils/snapshot.utils';
import { rootStore, visitor } from './../../index';
import { externalService } from './../../services/external.service';
import { Snapshot } from './snapshot';
import { StashTabSnapshot } from './stashtab-snapshot';

export class Profile {
  @persist uuid: string = uuidv4();

  @persist name: string = '';
  @persist @observable activeLeagueId: string = '';
  @persist @observable activePriceLeagueId: string = '';
  @persist @observable activeCharacterName: string = '';
  @persist('object') @observable activeCurrency: ICurrency = {
    name: 'chaos',
    short: 'c',
  };

  @persist('list') @observable activeStashTabIds: string[] = [];

  @persist('list', Snapshot) @observable snapshots: Snapshot[] = [];

  @persist @observable active: boolean = false;
  @persist @observable includeEquipment: boolean = false;
  @persist @observable includeInventory: boolean = false;
  @observable income: number = 0;
  @observable incomeResetAt: moment.Moment = moment().utc();

  constructor(obj?: IProfile) {
    makeObservable(this);
    Object.assign(this, obj);
  }

  @computed
  get readyToSnapshot() {
    const account = rootStore.accountStore.getSelectedAccount;
    const league = account.accountLeagues.find(
      (al) => account.activeLeague && al.leagueId === account.activeLeague.id
    );

    return (
      league &&
      league.stashtabs.length > 0 &&
      !rootStore.priceStore.isUpdatingPrices &&
      rootStore.uiStateStore.validated &&
      rootStore.uiStateStore.initiated &&
      !rootStore.uiStateStore.isSnapshotting &&
      this.hasPricesForActiveLeague
    );
  }

  @computed
  get hasPricesForActiveLeague() {
    const activePriceDetails = rootStore.priceStore.leaguePriceDetails.find(
      (l) => l.leagueId === this.activePriceLeagueId
    );
    const prices = activePriceDetails?.leaguePriceSources[0]?.prices;
    return prices !== undefined && prices.length > 0;
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
      mapSnapshotToApiSnapshot(this.snapshots[0]),
    ]);
    const previousSnapshotNetWorth = getValueForSnapshotsTabs([
      mapSnapshotToApiSnapshot(this.snapshots[1]),
    ]);

    return lastSnapshotNetWorth - previousSnapshotNetWorth;
  }

  @computed
  get chartData() {
    let snapshots = [...this.snapshots];

    if (snapshots.length === 0) {
      return undefined;
    }

    switch (rootStore.uiStateStore.chartTimeSpan) {
      case '1 day': {
        snapshots = snapshots.filter((s) => {
          return moment().subtract(24, 'h').isBefore(moment(s.created));
        });
        break;
      }
      case '1 week': {
        snapshots = snapshots.filter((s) => moment().subtract(7, 'd').isBefore(moment(s.created)));
        break;
      }
      case '1 month': {
        snapshots = snapshots.filter((s) => moment().subtract(30, 'd').isBefore(moment(s.created)));
        break;
      }
      default: {
        // all time
        break;
      }
    }

    const connectionSeries: IConnectionChartSeries = {
      seriesName: this.name,
      series: formatSnapshotsForChart(snapshots.map((s) => mapSnapshotToApiSnapshot(s))),
    };

    return [connectionSeries];
  }

  @computed
  get tabChartData() {
    const snapshots = [...this.snapshots.slice(0, 50)];

    const league = rootStore.leagueStore.leagues.find((l) => l.id === this.activeLeagueId);

    if (snapshots.length === 0 || !league) {
      return undefined;
    }

    const accountLeague = rootStore.accountStore.getSelectedAccount.accountLeagues.find(
      (l) => l.leagueId === league.id
    );

    if (!accountLeague) {
      return undefined;
    }

    const series: IConnectionChartSeries[] = [];

    let stashTabSnapshots: IChartStashTabSnapshot[] = [];

    snapshots.map((s) => {
      const data = s.stashTabSnapshots.map((sts) => {
        return {
          value: sts.value,
          stashTabId: sts.stashTabId,
          created: s.created,
        } as IChartStashTabSnapshot;
      });
      stashTabSnapshots = stashTabSnapshots.concat(data);
    });

    const groupedStashTabSnapshots = stashTabSnapshots.reduce(function (r, a) {
      r[a.stashTabId] = r[a.stashTabId] || [];
      r[a.stashTabId].push(a);
      return r;
    }, Object.create(null));

    this.activeStashTabIds.map((id) => {
      const stashTabName = accountLeague.stashtabs.find((s) => s.id === id)?.n;
      const serie: IConnectionChartSeries = {
        seriesName: stashTabName ?? '',
        series: formatStashTabSnapshotsForChart(
          groupedStashTabSnapshots[id] ? groupedStashTabSnapshots[id] : []
        ),
      };
      series.push(serie);
    });

    return series;
  }

  @computed
  get itemCount() {
    if (this.snapshots.length === 0) {
      return 0;
    }
    return getItemCount([mapSnapshotToApiSnapshot(this.snapshots[0])]);
  }

  @action
  calculateIncome() {
    const oneHourAgo = moment().utc().subtract(1, 'hours');
    const timestampToUse = this.incomeResetAt.isAfter(oneHourAgo) ? this.incomeResetAt : oneHourAgo;
    const snapshots = this.snapshots.filter((s) => moment(s.created).utc().isAfter(timestampToUse));
    const hoursToCalcOver = 1;

    if (snapshots.length > 1) {
      const lastSnapshot = mapSnapshotToApiSnapshot(snapshots[0]);
      const firstSnapshot = mapSnapshotToApiSnapshot(snapshots[snapshots.length - 1]);
      const incomePerHour =
        (calculateNetWorth([lastSnapshot]) - calculateNetWorth([firstSnapshot])) / hoursToCalcOver;
      this.income = incomePerHour;
      return;
    }

    this.income = 0;

    this.updateNetWorthOverlay();
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
  updateFromApiProfile(apiProfile: IApiProfile) {
    this.activeLeagueId = apiProfile.activeLeagueId;
    this.activePriceLeagueId = apiProfile.activePriceLeagueId;
    this.activeStashTabIds = apiProfile.activeStashTabIds;
    this.includeInventory = apiProfile.includeInventory;
    this.includeEquipment = apiProfile.includeEquipment;
    this.activeCharacterName = apiProfile.activeCharacterName;
    this.name = apiProfile.name;
  }

  @action
  updateProfile(profile: IProfile, callback: () => void) {
    visitor!.event('Profile', 'Edit profile').send();

    const apiProfile = mapProfileToApiProfile(new Profile(profile));

    fromStream(
      rootStore.signalrHub.invokeEvent<IApiProfile>('EditProfile', apiProfile).pipe(
        map(() => {
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
    rootStore.notificationStore.createNotification('update_profile', 'error', false, e);
  }

  @action
  updateProfileSuccess() {
    rootStore.notificationStore.createNotification('update_profile', 'success');
  }

  @action snapshot() {
    visitor!.event('Profile', 'Triggered snapshot').send();

    rootStore.uiStateStore!.setIsSnapshotting(true);
    this.refreshStashTabs();
  }

  @action clearIncome() {
    this.income = 0;
    this.incomeResetAt = moment().utc();
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
    rootStore.accountStore.getSelectedAccount.activeProfile!.updateNetWorthOverlay();
  }

  @action
  updateNetWorthOverlay() {
    const activeCurrency = rootStore.accountStore.getSelectedAccount!.activeProfile!
      ? rootStore.accountStore.getSelectedAccount!.activeProfile!.activeCurrency
      : { name: 'chaos', short: 'c' };

    const income = formatValue(
      rootStore.signalrStore.activeGroup
        ? rootStore.signalrStore.activeGroup.income
        : rootStore.accountStore.getSelectedAccount!.activeProfile!.income,
      activeCurrency.short,
      true
    );

    rootStore.overlayStore.updateOverlay({
      event: 'netWorth',
      data: {
        netWorth: rootStore.signalrStore.activeGroup
          ? rootStore.signalrStore.activeGroup.netWorthValue
          : rootStore.accountStore.getSelectedAccount.activeProfile!.netWorthValue,
        income: income,
      },
    });
  }

  @action snapshotFail(e?: AxiosError | Error) {
    rootStore.uiStateStore.resetStatusMessage();
    rootStore.notificationStore.createNotification('snapshot', 'error', true, e);
    if (rootStore.settingStore.autoSnapshotting) {
      rootStore.accountStore.getSelectedAccount.dequeueSnapshot();
      rootStore.accountStore.getSelectedAccount.queueSnapshot();
    }
    rootStore.uiStateStore!.setIsSnapshotting(false);
  }

  @action refreshStashTabs() {
    const accountLeague = rootStore.accountStore.getSelectedAccount.accountLeagues.find(
      (al) => al.leagueId === this.activeLeagueId
    );

    const league = rootStore.leagueStore.leagues.find((l) => l.id === this.activeLeagueId);

    if (!accountLeague || !league) {
      return this.getItemsFail(new Error('no_matching_league'), this.activeLeagueId);
    }

    rootStore.uiStateStore.setStatusMessage('refreshing_stash_tabs');

    fromStream(
      accountLeague.getStashTabs().pipe(
        mergeMap(() => of(this.refreshStashTabsSuccess(league.id))),
        catchError((e: AxiosError) => of(this.refreshStashTabsFail(e, league.id)))
      )
    );
  }

  @action refreshStashTabsSuccess(leagueId: string) {
    rootStore.notificationStore.createNotification(
      'refreshing_stash_tabs',
      'success',
      undefined,
      undefined,
      leagueId
    );
    this.getItems();
  }

  @action refreshStashTabsFail(e: AxiosError | Error, leagueId: string) {
    rootStore.notificationStore.createNotification(
      'refreshing_stash_tabs',
      'error',
      true,
      e,
      leagueId
    );
    this.snapshotFail();
  }

  @action getItems() {
    const accountLeague = rootStore.accountStore.getSelectedAccount.accountLeagues.find(
      (al) => al.leagueId === this.activeLeagueId
    );

    const league = rootStore.leagueStore.leagues.find((l) => l.id === this.activeLeagueId);

    if (!accountLeague || !league) {
      return this.getItemsFail(new Error('no_matching_league'), this.activeLeagueId);
    }

    const selectedStashTabs = accountLeague.stashtabs.filter(
      (st) => this.activeStashTabIds.find((ast) => ast === st.id) !== undefined
    );

    rootStore.uiStateStore.setStatusMessage(
      'fetching_stash_tab',
      undefined,
      1,
      selectedStashTabs.length
    );

    fromStream(
      forkJoin(
        externalService.getItemsForTabs(
          selectedStashTabs,
          rootStore.accountStore.getSelectedAccount.name!,
          league.id
        ),
        this.activeCharacterName &&
          this.activeCharacterName !== '' &&
          this.activeCharacterName !== 'None'
          ? externalService.getCharacterItems(
              rootStore.accountStore.getSelectedAccount.name!,
              this.activeCharacterName
            )
          : of(null)
      ).pipe(
        map((result) => {
          const stashTabsWithItems = result[0];
          const characterWithItems = result[1];
          if (characterWithItems?.data) {
            const characterItems = mapItemsToPricedItems(characterWithItems?.data?.items);
            let includedCharacterItems: IPricedItem[] = [];
            if (this.includeInventory) {
              includedCharacterItems = includedCharacterItems.concat(
                characterItems.filter((ci) => ci.inventoryId === 'MainInventory')
              );
            }
            if (this.includeEquipment) {
              includedCharacterItems = includedCharacterItems.concat(
                characterItems.filter((ci) => ci.inventoryId !== 'MainInventory')
              );
            }
            const characterTab: IStashTabSnapshot = {
              stashTabId: 'Character',
              value: 0,
              pricedItems: includedCharacterItems,
            };
            stashTabsWithItems.push(characterTab);
          }
          return stashTabsWithItems.map((stashTabWithItems) => {
            stashTabWithItems.pricedItems = mergeItemStacks(stashTabWithItems.pricedItems);
            return stashTabWithItems;
          });
        }),
        mergeMap((stashTabsWithItems) => of(this.getItemsSuccess(stashTabsWithItems, league.id))),
        catchError((e: AxiosError) => of(this.getItemsFail(e, league.id)))
      )
    );
  }

  @action getItemsSuccess(stashTabsWithItems: IStashTabSnapshot[], leagueId: string) {
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
    rootStore.notificationStore.createNotification('get_items', 'error', true, e, leagueId);
    this.snapshotFail();
  }

  @action
  priceItemsForStashTabs(stashTabsWithItems: IStashTabSnapshot[]) {
    rootStore.uiStateStore.setStatusMessage('pricing_items');
    let activePriceLeague = rootStore.accountStore.getSelectedAccount.activePriceLeague;

    if (!activePriceLeague) {
      this.setActivePriceLeague('Standard');
      activePriceLeague = rootStore.accountStore.getSelectedAccount.activePriceLeague;
    }

    const activePriceDetails = rootStore.priceStore.leaguePriceDetails.find(
      (l) => l.leagueId === activePriceLeague!.id
    );

    if (!activePriceDetails) {
      return this.priceItemsForStashTabsFail(new Error('no_prices_received_for_league'));
    }

    let prices = activePriceDetails.leaguePriceSources[0].prices;

    if (!rootStore.settingStore.lowConfidencePricing) {
      prices = prices.filter((p) => p.count > 10);
    }

    if (rootStore.settingStore.totalPriceTreshold === 0) {
      prices = prices.filter(
        (p) => p.calculated && p.calculated >= rootStore.settingStore.priceTreshold
      );
    }

    prices = excludeLegacyMaps(prices);

    const customPrices = rootStore.customPriceStore.customLeaguePrices.find(
      (cpl) => cpl.leagueId === activePriceLeague?.id
    )?.prices;

    if (customPrices) {
      customPrices.filter((x) => {
        const foundPrice = findPrice(prices, x);
        if (foundPrice) {
          foundPrice.customPrice = x.customPrice;
          const index = prices.indexOf(foundPrice);
          prices[index] = foundPrice;
        }
      });
    }

    const pricedStashTabs = stashTabsWithItems.map((stashTabWithItems: IStashTabSnapshot) => {
      stashTabWithItems.pricedItems = stashTabWithItems.pricedItems.map((item: IPricedItem) => {
        return pricingService.priceItem(item, prices);
      });
      return stashTabWithItems;
    });

    const mergedItems = mergeItemStacks(pricedStashTabs.flatMap((s) => s.pricedItems)).filter(
      (pi) => pi.total >= rootStore.settingStore.totalPriceTreshold && pi.total > 0
    );

    const filteredTabs = pricedStashTabs.map((pst) => {
      pst.pricedItems = pst.pricedItems.filter((pi) => findItem(mergedItems, pi));
      pst.value = pst.pricedItems.map((ts) => ts.total).reduce((a, b) => a + b, 0);

      return pst;
    });

    return this.priceItemsForStashTabsSuccess(filteredTabs);
  }

  @action
  priceItemsForStashTabsSuccess(pricedStashTabs: IStashTabSnapshot[]) {
    rootStore.notificationStore.createNotification('price_stash_items', 'success');
    this.saveSnapshot(pricedStashTabs);
  }

  @action
  priceItemsForStashTabsFail(e: AxiosError | Error) {
    rootStore.notificationStore.createNotification('price_stash_items', 'error', true, e);
    this.snapshotFail();
  }

  @action
  saveSnapshot(pricedStashTabs: IStashTabSnapshot[]) {
    rootStore.uiStateStore.setStatusMessage('saving_snapshot');
    const snapshot: ISnapshot = {
      stashTabSnapshots: pricedStashTabs.map((p) => new StashTabSnapshot(p)),
    };

    const snapshotToAdd = new Snapshot(snapshot);

    const activeAccountLeague = rootStore.accountStore.getSelectedAccount.accountLeagues.find(
      (al) => al.leagueId === this.activeLeagueId
    );

    if (activeAccountLeague) {
      const apiSnapshot = mapSnapshotToApiSnapshot(snapshotToAdd, activeAccountLeague.stashtabs);
      const callback = () => {
        // clear items from previous snapshot
        if (this.snapshots.length > 1) {
          this.snapshots[0].stashTabSnapshots.forEach((stss) => {
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
        this.calculateIncome();
      };
      fromStream(this.sendSnapshot(apiSnapshot, this.snapshotSuccess, this.snapshotFail, callback));
    }
  }

  @action
  sendSnapshot(
    snapshot: IApiSnapshot,
    successAction: () => void,
    failAction: (e: AxiosError) => void,
    callback?: () => void
  ) {
    return rootStore.signalrHub.invokeEvent<IApiSnapshot>('AddSnapshot', snapshot, this.uuid).pipe(
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
    rootStore.notificationStore.createNotification('remove_all_snapshots', 'success');

    this.updateNetWorthOverlay();
  }

  @action
  removeAllSnapshots() {
    rootStore.uiStateStore.setClearingSnapshots(true);
    fromStream(
      rootStore.signalrHub.invokeEvent<string>('RemoveAllSnapshots', this.uuid).pipe(
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
    rootStore.notificationStore.createNotification('remove_all_snapshots', 'error', false, e);
  }

  @action
  removeSnapshot() {
    if (this.snapshots.length > 0) {
      const lastSnapshotId = this.snapshots[0].uuid;
      fromStream(
        rootStore.signalrHub.invokeEvent<string>('RemoveSnapshot', lastSnapshotId).pipe(
          map(() => {
            runInAction(() => {
              this.snapshots.splice(0, 1)
            });
            return this.removeSnapshotSuccess();
          }),
          catchError((e: AxiosError) => of(this.removeSnapshotFail(e)))
        )
      );
    }
  }

  @action
  removeSnapshotSuccess() {
    rootStore.uiStateStore.setClearingSnapshots(false);
    rootStore.notificationStore.createNotification('remove_snapshot', 'success');
    this.updateNetWorthOverlay();
  }

  @action
  removeSnapshotFail(e: Error) {
    rootStore.uiStateStore.setClearingSnapshots(false);
    rootStore.notificationStore.createNotification('remove_snapshot', 'error', false, e);
  }
  
}

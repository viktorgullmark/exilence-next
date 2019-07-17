import { Action } from '@ngrx/store';
import { NetWorthState } from '../../app.states';
import { Tab } from '../../shared/interfaces/stash.interface';
import { ApplicationSessionDetails } from '../../shared/interfaces/application-session-details.interface';
import { PricedItem } from '../../shared/interfaces/priced-item.interface';
import { ExternalPrice } from '../../shared/interfaces/external-price.interface';
import { ExternalPrices } from '../../shared/interfaces/external-prices.interface';
import { Snapshot } from '../../shared/interfaces/snapshot.interface';
import { TabSelection } from '../../shared/interfaces/tab-selection.interface';
import { NetWorthSettings } from '../../shared/interfaces/net-worth-settings.interface';

export enum NetWorthActionTypes {
  LoadStateFromStorage = '[NetWorth] Load State From Storage',
  LoadStateFromStorageSuccess = '[NetWorth] Load State From Storage Success',
  LoadStateFromStorageFail = '[NetWorth] Load State From Storage Fail',
  OverrideState = '[NetWorth] Override State',
  UpdateTabSelection = '[NetWorth] Update TabSelection',
  FetchItemsForSnapshot = '[NetWorth] Fetch Items For Snapshot',
  FetchItemsForSnapshotSuccess = '[NetWorth] Fetch Items For Snapshot Success',
  FetchItemsForSnapshotFail = '[NetWorth] Fetch Items For Snapshot Fail',
  FetchPrices = '[NetWorth] Fetch Prices',
  FetchPricesSuccess = '[NetWorth] Fetch Prices Success',
  FetchPricesFail = '[NetWorth] Fetch Prices Fail',
  PriceItemsForSnapshot = '[NetWorth] Price Items For Snapshot',
  PriceItemsForSnapshotSuccess = '[NetWorth] Price Items For Snapshot Success',
  PriceItemsForSnapshotFail = '[NetWorth] Price Items For Snapshot Fail',
  AddTabs = '[NetWorth] Add Tabs',
  FetchTabsForSnapshot = '[NetWorth] Fetch Tabs For Snapshot',
  FetchTabsForSnapshotSuccess = '[NetWorth] Fetch Tabs For Snapshot Success',
  FetchTabsForSnapshotFail = '[NetWorth] Fetch Tabs For Snapshot Fail',
  IncrementFetchedTabsCount = '[NetWorth] Increment Fetched Tabs Count',
  ResetFetchedTabsCount = '[NetWorth] Reset Fetched Tabs Count',
  CreateSnapshot = '[NetWorth] Create Snapshot',
  CreateSnapshotSuccess = '[NetWorth] Create Snapshot Success',
  CreateSnapshotFail = '[NetWorth] Create Snapshot Fail',
  UpdateSettings = '[NetWorth] Update Settings',
}

export class LoadStateFromStorage implements Action {
  readonly type = NetWorthActionTypes.LoadStateFromStorage;
  constructor() { }
}

export class LoadStateFromStorageSuccess implements Action {
  readonly type = NetWorthActionTypes.LoadStateFromStorageSuccess;
  constructor(public payload: { title: string, message: string }) { }
}

export class LoadStateFromStorageFail implements Action {
  readonly type = NetWorthActionTypes.LoadStateFromStorageFail;
  constructor(public payload: { title: string, message: string }) { }
}

export class OverrideState implements Action {
  readonly type = NetWorthActionTypes.OverrideState;

  constructor(public payload: { state: NetWorthState }) { }
}

export class UpdateSettings implements Action {
  readonly type = NetWorthActionTypes.UpdateSettings;

  constructor(public payload: { settings: NetWorthSettings }) { }
}

export class FetchTabsForSnapshot implements Action {
  readonly type = NetWorthActionTypes.FetchTabsForSnapshot;

  constructor(public payload: { accountDetails: ApplicationSessionDetails, league: string, tabs: Tab[] }) { }
}

export class FetchTabsForSnapshotSuccess implements Action {
  readonly type = NetWorthActionTypes.FetchTabsForSnapshotSuccess;
  constructor(public payload: {
    accountDetails: ApplicationSessionDetails, tabs: Tab[],
    tabCount: number, title: string, message: string
  }) { }
}

export class FetchTabsForSnapshotFail implements Action {
  readonly type = NetWorthActionTypes.FetchTabsForSnapshotFail;
  constructor(public payload: { title: string, message: string }) { }
}

export class AddTabs implements Action {
  readonly type = NetWorthActionTypes.AddTabs;
  constructor(public payload: { tabs: Tab[] }) { }
}

export class UpdateTabSelection implements Action {
  readonly type = NetWorthActionTypes.UpdateTabSelection;
  constructor(public payload: { tabs: TabSelection[], league: string }) { }
}

export class IncrementFetchedTabsCount implements Action {
  readonly type = NetWorthActionTypes.IncrementFetchedTabsCount;
  constructor() { }
}

export class ResetFetchedTabsCount implements Action {
  readonly type = NetWorthActionTypes.ResetFetchedTabsCount;
  constructor() { }
}

export class FetchItemsForSnapshot implements Action {
  readonly type = NetWorthActionTypes.FetchItemsForSnapshot;
  constructor(public payload: { tabs: Tab[] }) { }
}

export class FetchItemsForSnapshotSuccess implements Action {
  readonly type = NetWorthActionTypes.FetchItemsForSnapshotSuccess;
  constructor(public payload: { tabs: Tab[] }) { }
}

export class FetchItemsForSnapshotFail implements Action {
  readonly type = NetWorthActionTypes.FetchItemsForSnapshotFail;
  constructor(public payload: { title: string, message: string }) { }
}

export class PriceItemsForSnapshot implements Action {
  readonly type = NetWorthActionTypes.PriceItemsForSnapshot;
  constructor(public payload: { prices: ExternalPrices, tabs: Tab[] }) { }
}

export class PriceItemsForSnapshotSuccess implements Action {
  readonly type = NetWorthActionTypes.PriceItemsForSnapshotSuccess;
  constructor(public payload: { tabs: Tab[] }) { }
}

export class PriceItemsForSnapshotFail implements Action {
  readonly type = NetWorthActionTypes.PriceItemsForSnapshotFail;
  constructor(public payload: { title: string, message: string }) { }
}

export class FetchPrices implements Action {
  readonly type = NetWorthActionTypes.FetchPrices;
  constructor(public payload: { league: string }) { }
}

export class FetchPricesSuccess implements Action {
  readonly type = NetWorthActionTypes.FetchPricesSuccess;
  constructor(public payload: { poeNinja: ExternalPrice[], poeWatch: ExternalPrice[] }) { }
}

export class FetchPricesFail implements Action {
  readonly type = NetWorthActionTypes.FetchPricesFail;
  constructor(public payload: { title: string, message: string }) { }
}

export class CreateSnapshot implements Action {
  readonly type = NetWorthActionTypes.CreateSnapshot;
  constructor(public payload: { tabs: Tab[] }) { }
}

export class CreateSnapshotFail implements Action {
  readonly type = NetWorthActionTypes.CreateSnapshotFail;
  constructor(public payload: { title: string, message: string }) { }
}

export class CreateSnapshotSuccess implements Action {
  readonly type = NetWorthActionTypes.CreateSnapshotSuccess;
  constructor(public payload: { snapshot: Snapshot }) { }
}

export type NetWorthActions =
  OverrideState |
  LoadStateFromStorage | LoadStateFromStorageSuccess | LoadStateFromStorageFail |
  AddTabs |
  PriceItemsForSnapshot | PriceItemsForSnapshotSuccess | PriceItemsForSnapshotFail |
  FetchItemsForSnapshot | FetchItemsForSnapshotSuccess | FetchItemsForSnapshotFail |
  FetchTabsForSnapshot | FetchTabsForSnapshotSuccess | FetchTabsForSnapshotFail |
  FetchPrices | FetchPricesSuccess | FetchPricesFail |
  UpdateTabSelection | IncrementFetchedTabsCount | ResetFetchedTabsCount |
  CreateSnapshot | CreateSnapshotSuccess | CreateSnapshotFail |
  UpdateSettings;

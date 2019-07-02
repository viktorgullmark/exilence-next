import { Action } from '@ngrx/store';
import { NetWorthState } from '../../app.states';
import { Tab } from '../../shared/interfaces/stash.interface';
import { ApplicationSessionDetails } from '../../shared/interfaces/application-session-details.interface';
import { PricedItem } from '../../shared/interfaces/priced-item.interface';
import { ExternalPrice } from '../../shared/interfaces/external-price.interface';

export enum NetWorthActionTypes {
  SetState = '[NetWorth] Set State',
  UpdateTabSelection = '[NetWorth] Update TabSelection',
  LoadTabs = '[NetWorth] Load Tabs',
  LoadTabsSuccess = '[NetWorth] Load Tabs Success',
  LoadTabsFail = '[NetWorth] Load Tabs Fail',
  FetchItemsForSnapshot = '[NetWorth] Fetch Items For Snapshot',
  FetchItemsForSnapshotSuccess = '[NetWorth] Fetch Items For Snapshot Success',
  FetchItemsForSnapshotFail = '[NetWorth] Fetch Items For Snapshot Fail',
  FetchPrices = '[NetWorth] Fetch Prices',
  FetchPricesSuccess = '[NetWorth] Fetch Prices',
  FetchPricesFail = '[NetWorth] Fetch Prices'
}

export class SetState implements Action {
  readonly type = NetWorthActionTypes.SetState;

  constructor(public payload: { state: NetWorthState }) { }
}

export class UpdateTabSelection implements Action {
  readonly type = NetWorthActionTypes.UpdateTabSelection;
  constructor(public payload: { tabs: string[] }) { }
}

export class FetchItemsForSnapshot implements Action {
  readonly type = NetWorthActionTypes.FetchItemsForSnapshot;
  constructor(public payload: { accountDetails: ApplicationSessionDetails, tabs: Tab[] }) { }
}

export class FetchItemsForSnapshotSuccess implements Action {
  readonly type = NetWorthActionTypes.FetchItemsForSnapshotSuccess;
  constructor(public payload: { items: PricedItem[] }) { }
}

export class FetchItemsForSnapshotFail implements Action {
  readonly type = NetWorthActionTypes.FetchItemsForSnapshotFail;
  constructor(public payload: { error: string }) { }
}

export class FetchPrices implements Action {
  readonly type = NetWorthActionTypes.FetchPrices;
  constructor() { }
}

export class FetchPricesSuccess implements Action {
  readonly type = NetWorthActionTypes.FetchPricesSuccess;
  constructor(public payload: { prices: ExternalPrice[] }) { }
}

export class FetchPricesFail implements Action {
  readonly type = NetWorthActionTypes.FetchPricesFail;
  constructor(public payload: { error: string }) { }
}

export class LoadTabs implements Action {
  readonly type = NetWorthActionTypes.LoadTabs;
  constructor() { }
}

export class LoadTabsSuccess implements Action {
  readonly type = NetWorthActionTypes.LoadTabsSuccess;
  constructor(public payload: { tabs: any[] }) { }
}

export class LoadTabsFail implements Action {
  readonly type = NetWorthActionTypes.LoadTabsFail;
  constructor(public payload: { error: string }) { }
}

export type NetWorthActions =
  SetState |
  FetchItemsForSnapshot | FetchItemsForSnapshotSuccess | FetchItemsForSnapshotFail |
  FetchPrices | FetchPricesSuccess | FetchPricesFail |
  LoadTabs | LoadTabsSuccess | LoadTabsFail |
  UpdateTabSelection;

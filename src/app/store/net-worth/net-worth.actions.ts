import { Action } from '@ngrx/store';

export enum NetWorthActionTypes {
  UpdateTabSelection = '[NetWorth] Update TabSelection',
  LoadTabs = '[NetWorth] Load Tabs',
  LoadTabsSuccess = '[NetWorth] Load Tabs Success',
  LoadTabsFail = '[NetWorth] Load Tabs Fail'
}

export class UpdateTabSelection implements Action {
  readonly type = NetWorthActionTypes.UpdateTabSelection;
  constructor(public payload: { tabs: string[] }) { }
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
  LoadTabs | LoadTabsSuccess | LoadTabsFail |
  UpdateTabSelection;

import { Action } from '@ngrx/store';
import { Session } from '../../shared/interfaces/session.interface';

export enum ApplicationActionTypes {
  UpdateSnapshotStatus = '[Application] Update SnapshotStatus',
  UpdateTabSelection = '[Application] Update TabSelection',
  InitSession = '[Application] Init Session',


  LoadTabs = '[Applications] Load Tabs',
  LoadTabsSuccess = '[Applications] Load Tabs Success',
  LoadTabsFail = '[Applications] Load Tabs Fail'


}

export class UpdateSnapshotStatus implements Action {
  readonly type = ApplicationActionTypes.UpdateSnapshotStatus;

  constructor(public payload: { running: boolean }) {}
}

export class UpdateTabSelection implements Action {
  readonly type = ApplicationActionTypes.UpdateTabSelection;

  constructor(public payload: { tabs: string[] }) {}
}

export class InitSession implements Action {
  readonly type = ApplicationActionTypes.InitSession;

  constructor(public payload: { session: Session }) {}
}

export class LoadTabs implements Action {
  readonly type = ApplicationActionTypes.LoadTabs;
  constructor() {}
}

export class LoadTabsSuccess implements Action {
  readonly type = ApplicationActionTypes.LoadTabsSuccess;
  constructor(public payload: { tabs: any[] }) {}
}

export class LoadTabsFail implements Action {
  readonly type = ApplicationActionTypes.LoadTabsFail;
  constructor(public payload: { error: string }) {}
}



export type ApplicationActions = 
LoadTabs | LoadTabsSuccess | LoadTabsFail |
UpdateSnapshotStatus | 
UpdateTabSelection |
InitSession;

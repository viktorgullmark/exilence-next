import { Action } from '@ngrx/store';
import { Session } from '../../shared/interfaces/session.interface';

export enum ApplicationActionTypes {
  UpdateSnapshotStatus = '[Application] Update SnapshotStatus',
  UpdateTabSelection = '[Application] Update TabSelection',
  InitSession = '[Application] Init Session'
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

export type ApplicationActions = 
UpdateSnapshotStatus | 
UpdateTabSelection |
InitSession;

import { Action } from '@ngrx/store';
import { Session } from '../../shared/interfaces/session.interface';

export enum ApplicationActionTypes {
  UpdateSnapshotStatus = '[Application] Update SnapshotStatus',
  InitSession = '[Application] Init Session'
}

export class UpdateSnapshotStatus implements Action {
  readonly type = ApplicationActionTypes.UpdateSnapshotStatus;

  constructor(public payload: { running: boolean }) {}
}

export class InitSession implements Action {
  readonly type = ApplicationActionTypes.InitSession;

  constructor(public payload: { session: Session }) {}
}

export type ApplicationActions = UpdateSnapshotStatus | InitSession;

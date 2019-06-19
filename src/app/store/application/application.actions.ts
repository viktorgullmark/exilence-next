import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { Application } from '../../shared/interfaces/application.interface';

export enum ApplicationActionTypes {
  UpdateApplication = '[Application] Update Application',
  UpdateSnapshotStatus = '[Application] Update SnapshotStatus'
}

export class UpdateApplication implements Action {
  readonly type = ApplicationActionTypes.UpdateApplication;

  constructor(public payload: { application: Application }) {}
}

export class UpdateSnapshotStatus implements Action {
  readonly type = ApplicationActionTypes.UpdateSnapshotStatus;

  constructor(public payload: { running: boolean }) {}
}

export type ApplicationActions = UpdateApplication | UpdateSnapshotStatus;

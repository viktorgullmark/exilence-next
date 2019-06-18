import { Action } from '@ngrx/store';
import { TabSnapshot } from '../../shared/interfaces/tab-snapshot.interface';

export enum TabSnapshotActionTypes {
  LoadTabSnapshots = '[TabSnapshot] Load TabSnapshots',
  AddTabSnapshot = '[TabSnapshot] Add TabSnapshot',
  AddTabSnapshots = '[TabSnapshot] Add TabSnapshots',
  DeleteTabSnapshot = '[TabSnapshot] Delete TabSnapshot',
  ClearTabSnapshots = '[TabSnapshot] Clear TabSnapshots'
}

export class LoadTabSnapshots implements Action {
  readonly type = TabSnapshotActionTypes.LoadTabSnapshots;

  constructor(public payload: { tabSnapshots: TabSnapshot[] }) {}
}

export class AddTabSnapshot implements Action {
  readonly type = TabSnapshotActionTypes.AddTabSnapshot;

  constructor(public payload: { tabSnapshot: TabSnapshot }) {}
}

export class AddTabSnapshots implements Action {
  readonly type = TabSnapshotActionTypes.AddTabSnapshots;

  constructor(public payload: { tabSnapshots: TabSnapshot[] }) {}
}

export class DeleteTabSnapshot implements Action {
  readonly type = TabSnapshotActionTypes.DeleteTabSnapshot;

  constructor(public payload: { id: string }) {}
}

export class ClearTabSnapshots implements Action {
  readonly type = TabSnapshotActionTypes.ClearTabSnapshots;
}

export type TabSnapshotActions =
 LoadTabSnapshots
 | AddTabSnapshot
 | AddTabSnapshots
 | DeleteTabSnapshot
 | ClearTabSnapshots;

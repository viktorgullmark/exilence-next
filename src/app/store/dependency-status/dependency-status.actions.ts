import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity/src/models';
import { DependencyStatus } from '../../shared/interfaces/dependency-status.interface';

export enum DependencyStatusActionTypes {
  ADD_DEPENDENCY_STATUS = '[DEPENDENCY_STATUS] Add Dependency Status',
  UPDATE_DEPENDENCY_STATUS = '[DEPENDENCY_STATUS] Update Dependency Status'
}

export class AddDepStatus implements Action {
  readonly type = DependencyStatusActionTypes.ADD_DEPENDENCY_STATUS;
  constructor(public payload: { status: DependencyStatus }) { }
}

export class UpdateDepStatus implements Action {
  readonly type = DependencyStatusActionTypes.UPDATE_DEPENDENCY_STATUS;
  constructor(public payload: { status: Update<DependencyStatus> }) { }
}

export type DEPENDENCY_STATUS_ACTIONS = AddDepStatus | UpdateDepStatus;

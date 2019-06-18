import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { ApplicationStatus } from '../../shared/interfaces/application-status.interface';

export enum ApplicationStatusActionTypes {
  AddApplicationStatus = '[ApplicationStatus] Add ApplicationStatus',
  UpdateApplicationStatus = '[ApplicationStatus] Update ApplicationStatus'
}

export class AddApplicationStatus implements Action {
  readonly type = ApplicationStatusActionTypes.AddApplicationStatus;

  constructor(public payload: { applicationStatus: ApplicationStatus }) {}
}

export class UpdateApplicationStatus implements Action {
  readonly type = ApplicationStatusActionTypes.UpdateApplicationStatus;

  constructor(public payload: { applicationStatus: Update<ApplicationStatus> }) {}
}

export type ApplicationStatusActions =
 AddApplicationStatus
 | UpdateApplicationStatus;

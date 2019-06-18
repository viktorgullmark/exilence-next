import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { ApplicationStatus } from '../../shared/interfaces/application-status.interface';

export enum ApplicationStatusActionTypes {
  AddApplicationStatus = '[ApplicationStatus] Add ApplicationStatus',
  UpdateApplicationStatus = '[ApplicationStatus] Update ApplicationStatus'
}


export class UpdateApplicationStatus implements Action {
  readonly type = ApplicationStatusActionTypes.UpdateApplicationStatus;

  constructor(public payload: { applicationStatus: ApplicationStatus }) {}
}

export type ApplicationStatusActions = UpdateApplicationStatus;

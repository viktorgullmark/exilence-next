import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { Application } from '../../shared/interfaces/application.interface';

export enum ApplicationActionTypes {
  UpdateApplication = '[Application] Update ApplicationStatus'
}

export class UpdateApplication implements Action {
  readonly type = ApplicationActionTypes.UpdateApplication;

  constructor(public payload: { application: Application }) {}
}

export type ApplicationActions = UpdateApplication;

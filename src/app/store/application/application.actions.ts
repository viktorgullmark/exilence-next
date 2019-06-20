import { Action } from '@ngrx/store';

import { ApplicationSession } from '../../shared/interfaces/application-session.interface';
import { ApplicationSessionDetails } from '../../shared/interfaces/application-session-details.interface';

export enum ApplicationActionTypes {
  InitSession = '[Application] Init Session',
  ValidateSession = '[Application] Validate Session',
  ValidateSessionSuccess = '[Application] Validate Session Success',
  ValidateSessionFail = '[Application] Validate Session Fail'
}

export class InitSession implements Action {
  readonly type = ApplicationActionTypes.InitSession;

  constructor(public payload: { session: ApplicationSession }) {}
}

export class ValidateSession implements Action {
  readonly type = ApplicationActionTypes.ValidateSession;

  constructor(public payload: { accountDetails: ApplicationSessionDetails }) {}
}

export class ValidateSessionSuccess implements Action {
  readonly type = ApplicationActionTypes.ValidateSessionSuccess;
  constructor(public payload: { }) { }
}

export class ValidateSessionFail implements Action {
  readonly type = ApplicationActionTypes.ValidateSessionFail;
  constructor(public payload: { error: string }) { }
}


export type ApplicationActions =
InitSession |
ValidateSession | ValidateSessionSuccess | ValidateSessionFail;

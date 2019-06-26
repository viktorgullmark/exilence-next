import { Action } from '@ngrx/store';

import { ApplicationSession } from '../../shared/interfaces/application-session.interface';
import { ApplicationSessionDetails } from '../../shared/interfaces/application-session-details.interface';

export enum ApplicationActionTypes {
  InitSession = '[Application] Init Session',
  InitSessionSuccess = '[Application] Init Session Success',
  InitSessionFail = '[Application] Init Session Fail',
  ValidateSession = '[Application] Validate Session',
  ValidateSessionSuccess = '[Application] Validate Session Success',
  ValidateSessionFail = '[Application] Validate Session Fail',
  SetTrialCookie = '[Application] Set Trial Cookie',
}

export class InitSession implements Action {
  readonly type = ApplicationActionTypes.InitSession;

  constructor(public payload: { accountDetails: ApplicationSessionDetails }) {}
}

export class InitSessionSuccess implements Action {
  readonly type = ApplicationActionTypes.InitSessionSuccess;
  constructor(public payload: { accountDetails: ApplicationSessionDetails, leagues: string[], characters: string[] }) { }
}

export class InitSessionFail implements Action {
  readonly type = ApplicationActionTypes.InitSessionFail;
  constructor(public payload: { error: string }) { }
}

export class ValidateSession implements Action {
  readonly type = ApplicationActionTypes.ValidateSession;

  constructor(public payload: { accountDetails: ApplicationSessionDetails, league: string }) {}
}

export class ValidateSessionSuccess implements Action {
  readonly type = ApplicationActionTypes.ValidateSessionSuccess;
  constructor() { }
}

export class ValidateSessionFail implements Action {
  readonly type = ApplicationActionTypes.ValidateSessionFail;
  constructor(public payload: { title: string, message: string }) { }
}

export class SetTrialCookie implements Action {
  readonly type = ApplicationActionTypes.SetTrialCookie;
  constructor(public payload: { accountDetails: ApplicationSessionDetails, league: string }) { }
}

export type ApplicationActions =
InitSession | InitSessionSuccess | InitSessionFail |
ValidateSession | ValidateSessionSuccess | ValidateSessionFail |
SetTrialCookie;

import { Action } from '@ngrx/store';

import { ApplicationSession } from '../../shared/interfaces/application-session.interface';
import { ApplicationSessionDetails } from '../../shared/interfaces/application-session-details.interface';

export enum ApplicationActionTypes {
  InitSession = '[Application] Init Session',
  LoadCharLeagues = '[Application] Load CharLeagues',
  LoadCharLeaguesSuccess = '[Application] Load CharLeagues Success',
  LoadCharLeaguesFail = '[Application] Load CharLeagues Fail',
  ValidateSession = '[Application] Validate Session',
  ValidateSessionSuccess = '[Application] Validate Session Success',
  ValidateSessionFail = '[Application] Validate Session Fail'
}

export class InitSession implements Action {
  readonly type = ApplicationActionTypes.InitSession;

  constructor(public payload: { accountDetails: ApplicationSessionDetails }) {}
}

export class LoadCharLeagues implements Action {
  readonly type = ApplicationActionTypes.LoadCharLeagues;

  constructor(public payload: { accountDetails: ApplicationSessionDetails }) {}
}

export class LoadCharLeaguesSuccess implements Action {
  readonly type = ApplicationActionTypes.LoadCharLeaguesSuccess;
  constructor(public payload: { accountDetails: ApplicationSessionDetails, leagues: string[], characters: string[] }) { }
}

export class LoadCharLeaguesFail implements Action {
  readonly type = ApplicationActionTypes.LoadCharLeaguesFail;
  constructor(public payload: { error: string }) { }
}

export class ValidateSession implements Action {
  readonly type = ApplicationActionTypes.ValidateSession;

  constructor(public payload: { accountDetails: ApplicationSessionDetails, leagues: string[] }) {}
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
LoadCharLeagues | LoadCharLeaguesSuccess | LoadCharLeaguesFail |
ValidateSession | ValidateSessionSuccess | ValidateSessionFail;

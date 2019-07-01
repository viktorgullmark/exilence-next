import { Action } from '@ngrx/store';

import { ApplicationSession } from '../../shared/interfaces/application-session.interface';
import { ApplicationSessionDetails } from '../../shared/interfaces/application-session-details.interface';
import { Character } from '../../shared/interfaces/character.interface';
import { League } from '../../shared/interfaces/league.interface';
import { Tab } from '../../shared/interfaces/stash.interface';

export enum ApplicationActionTypes {
  LoadAppState = '[Application] Load App State',
  InitSession = '[Application] Init Session',
  InitSessionSuccess = '[Application] Init Session Success',
  InitSessionFail = '[Application] Init Session Fail',
  ValidateSession = '[Application] Validate Session',
  ValidateSessionSuccess = '[Application] Validate Session Success',
  ValidateSessionFail = '[Application] Validate Session Fail',
  SetTrialCookie = '[Application] Set Trial Cookie',
  SetLeague = '[Application] Set League',
  SetTradeLeague = '[Application] Set Trade League',
  SetSession = '[Application] Set Session',
  AddCharacters = '[Application] Add Characters',
  AddLeagues = '[Application] Add Leagues',
  AddTabs = '[Application] Add Tabs'
}

export class LoadAppState implements Action {
  readonly type = ApplicationActionTypes.LoadAppState;

  constructor() { }
}

export class InitSession implements Action {
  readonly type = ApplicationActionTypes.InitSession;

  constructor(public payload: { accountDetails: ApplicationSessionDetails }) { }
}

export class SetSession implements Action {
  readonly type = ApplicationActionTypes.SetSession;

  constructor(public payload: { session: ApplicationSession }) { }
}

export class AddCharacters implements Action {
  readonly type = ApplicationActionTypes.AddCharacters;

  constructor(public payload: { characters: Character[] }) { }
}

export class AddLeagues implements Action {
  readonly type = ApplicationActionTypes.AddLeagues;

  constructor(public payload: { leagues: string[] }) { }
}

export class AddTabs implements Action {
  readonly type = ApplicationActionTypes.AddTabs;

  constructor(public payload: { tabs: Tab[] }) { }
}

export class SetLeague implements Action {
  readonly type = ApplicationActionTypes.SetLeague;

  constructor(public payload: { league: string }) { }
}

export class SetTradeLeague implements Action {
  readonly type = ApplicationActionTypes.SetTradeLeague;

  constructor(public payload: { tradeLeague: string }) { }
}

export class InitSessionSuccess implements Action {
  readonly type = ApplicationActionTypes.InitSessionSuccess;
  constructor(public payload: { accountDetails: ApplicationSessionDetails, leagues: string[], characters: Character[] }) { }
}

export class InitSessionFail implements Action {
  readonly type = ApplicationActionTypes.InitSessionFail;
  constructor(public payload: { title: string, message: string }) { }
}

export class ValidateSession implements Action {
  readonly type = ApplicationActionTypes.ValidateSession;

  constructor(public payload: { accountDetails: ApplicationSessionDetails, league: string }) { }
}

export class ValidateSessionSuccess implements Action {
  readonly type = ApplicationActionTypes.ValidateSessionSuccess;
  constructor(public payload: { accountDetails: ApplicationSessionDetails }) { }
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
  LoadAppState |
  AddCharacters | AddLeagues | AddTabs |
  SetLeague | SetTradeLeague |
  InitSession | InitSessionSuccess | InitSessionFail | SetSession |
  ValidateSession | ValidateSessionSuccess | ValidateSessionFail |
  SetTrialCookie;

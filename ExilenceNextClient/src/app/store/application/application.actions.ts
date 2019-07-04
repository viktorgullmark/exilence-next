import { Action } from '@ngrx/store';

import { ApplicationSession } from '../../shared/interfaces/application-session.interface';
import { ApplicationSessionDetails } from '../../shared/interfaces/application-session-details.interface';
import { Character } from '../../shared/interfaces/character.interface';
import { League } from '../../shared/interfaces/league.interface';
import { Tab } from '../../shared/interfaces/stash.interface';
import { ApplicationState } from '../../app.states';

export enum ApplicationActionTypes {
  LoadStateFromStorage = '[Application] Load State From Storage',
  LoadStateFromStorageSuccess = '[Application] Load State From Storage Success',
  LoadStateFromStorageFail = '[Application] Load State From Storage Fail',
  OverrideState = '[Application] Override State',
  InitSession = '[Application] Init Session',
  InitSessionSuccess = '[Application] Init Session Success',
  InitSessionFail = '[Application] Init Session Fail',
  ValidateSessionForLogin = '[Application] Validate Session For Login',
  ValidateSessionForLoginSuccess = '[Application] Validate Session For Login Success',
  ValidateSessionForLoginFail = '[Application] Validate Session For Login Fail',
  ValidateSession = '[Application] Validate Session',
  ValidateSessionSuccess = '[Application] Validate Session Success',
  ValidateSessionFail = '[Application] Validate Session Fail',
  SetValidateCookieForLogin = '[Application] Set Validate Cookie For Login',
  SetValidateCookie = '[Application] Set Validate Cookie',
  SetLeague = '[Application] Set League',
  SetTradeLeague = '[Application] Set Trade League',
  SetSession = '[Application] Set Session',
  AddCharacters = '[Application] Add Characters',
  AddCharacterLeagues = '[Application] Add Character Leagues',
  AddTradeLeagues = '[Application] Add Trade Leagues'
}

export class LoadStateFromStorage implements Action {
  readonly type = ApplicationActionTypes.LoadStateFromStorage;
  constructor() { }
}

export class LoadStateFromStorageSuccess implements Action {
  readonly type = ApplicationActionTypes.LoadStateFromStorageSuccess;
  constructor() { }
}

export class LoadStateFromStorageFail implements Action {
  readonly type = ApplicationActionTypes.LoadStateFromStorageFail;
  constructor(public payload: { title: string, message: string }) { }
}

export class OverrideState implements Action {
  readonly type = ApplicationActionTypes.OverrideState;

  constructor(public payload: { state: ApplicationState }) { }
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

export class AddCharacterLeagues implements Action {
  readonly type = ApplicationActionTypes.AddCharacterLeagues;

  constructor(public payload: { leagues: string[] }) { }
}

export class AddTradeLeagues implements Action {
  readonly type = ApplicationActionTypes.AddTradeLeagues;

  constructor(public payload: { leagues: string[] }) { }
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

export class ValidateSessionForLogin implements Action {
  readonly type = ApplicationActionTypes.ValidateSessionForLogin;

  constructor(public payload: { accountDetails: ApplicationSessionDetails, league: string }) { }
}

export class ValidateSessionForLoginSuccess implements Action {
  readonly type = ApplicationActionTypes.ValidateSessionForLoginSuccess;
  constructor(public payload: { accountDetails: ApplicationSessionDetails }) { }
}

export class ValidateSessionForLoginFail implements Action {
  readonly type = ApplicationActionTypes.ValidateSessionForLoginFail;
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

export class SetValidateCookieForLogin implements Action {
  readonly type = ApplicationActionTypes.SetValidateCookieForLogin;
  constructor(public payload: { accountDetails: ApplicationSessionDetails, league: string }) { }
}

export class SetValidateCookie implements Action {
  readonly type = ApplicationActionTypes.SetValidateCookie;
  constructor(public payload: { accountDetails: ApplicationSessionDetails, league: string }) { }
}

export type ApplicationActions =
  OverrideState |
  LoadStateFromStorage | LoadStateFromStorageSuccess | LoadStateFromStorageFail |
  AddCharacters | AddCharacterLeagues | AddTradeLeagues |
  SetLeague | SetTradeLeague |
  InitSession | InitSessionSuccess | InitSessionFail | SetSession |
  ValidateSessionForLogin | ValidateSessionForLoginSuccess | ValidateSessionForLoginFail |
  ValidateSession | ValidateSessionSuccess | ValidateSessionFail |
  SetValidateCookieForLogin | SetValidateCookie;

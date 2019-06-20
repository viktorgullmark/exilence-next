import { Action } from '@ngrx/store';

import { Session } from '../../shared/interfaces/session.interface';

export enum ApplicationActionTypes {
  InitSession = '[Application] Init Session'
}

export class InitSession implements Action {
  readonly type = ApplicationActionTypes.InitSession;

  constructor(public payload: { session: Session }) {}
}


export type ApplicationActions =
InitSession;

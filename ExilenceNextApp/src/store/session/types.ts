import { ApplicationSession } from './../../interfaces/application-session.interface';

export interface SessionState {
    session?: ApplicationSession;
}

export const INIT_SESSION = "INIT_SESSION";
export const INIT_SESSION_SUCCESS = "INIT_SESSION_SUCCESS";

interface InitSessionAction {
    type: typeof INIT_SESSION;
    payload: ApplicationSession;
}

interface InitSessionSuccessAction {
    type: typeof INIT_SESSION_SUCCESS;
}

export type SessionActionTypes = InitSessionAction | InitSessionSuccessAction;

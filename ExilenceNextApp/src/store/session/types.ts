import { ApplicationSession } from './../../interfaces/application-session.interface';

export interface SessionState {
    session?: ApplicationSession;
}

export const INIT_SESSION = "INIT_SESSION";

interface InitSessioneAction {
    type: typeof INIT_SESSION;
    payload: ApplicationSession;
}

export type SessionActionTypes = InitSessioneAction;

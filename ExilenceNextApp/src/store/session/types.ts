import { ApplicationSession } from './../../interfaces/application-session.interface';

export interface SessionState {
    session?: ApplicationSession;
}

export const INIT_SESSION = "INIT_SESSION";
export const INIT_SESSION_SUCCESS = "INIT_SESSION_SUCCESS";
import { ApplicationSession } from './../../interfaces/application-session.interface';
import { INIT_SESSION, INIT_SESSION_SUCCESS } from './types';

export function initSession(newSession: ApplicationSession) {
  return {
    type: INIT_SESSION,
    payload: newSession
  };
}

export function initSessionSuccess() {
  return {
    type: INIT_SESSION_SUCCESS
  };
}
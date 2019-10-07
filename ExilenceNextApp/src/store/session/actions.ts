import { ApplicationSession } from './../../interfaces/application-session.interface';
import { INIT_SESSION } from './types';

export function initSession(newSession: ApplicationSession) {
  return {
    type: INIT_SESSION,
    payload: newSession
  };
}
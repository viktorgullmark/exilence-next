import { ApplicationSession } from './../../interfaces/application-session.interface';
import { INIT_SESSION, INIT_SESSION_SUCCESS } from './types';
import { createAction } from 'typesafe-actions';

export const initSessionAction = createAction(INIT_SESSION, resolve => (payload: ApplicationSession) => resolve(payload));
export const initSessionSuccessAction = createAction(INIT_SESSION_SUCCESS)

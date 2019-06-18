import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';

import { AppConfig } from '../../environments/environment';
import { AppState } from '../app.states';
import * as notificationReducer from './notification/notification.reducer';

export const reducers: ActionReducerMap<AppState> = {
  notificationsState: notificationReducer.reducer
};

export function logger(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
  return function(state: AppState, action: any): AppState {
    console.log('action', action);
    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<AppState>[] = !AppConfig.production
  ? [logger]
  : [];

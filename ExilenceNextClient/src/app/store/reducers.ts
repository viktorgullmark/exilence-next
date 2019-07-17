import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';

import { AppConfig } from '../../environments/environment';
import { AppState } from '../app.states';
import * as notificationReducer from './notification/notification.reducer';
import * as applicationReducer from './application/application.reducer';
import * as netWorthReducer from './net-worth/net-worth.reducer';

export const reducers: ActionReducerMap<AppState> = {
  notificationsState: notificationReducer.reducer,
  applicationState: applicationReducer.reducer,
  netWorthState: netWorthReducer.reducer
};

export function logger(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
  return function(state: AppState, action: any): AppState {
    console.log('state', state);
    console.log('action', action);
    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<AppState>[] = !AppConfig.production
  ? []
  : [];

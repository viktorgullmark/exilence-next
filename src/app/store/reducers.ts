import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';

import { AppConfig } from '../../environments/environment';
import { AppState } from '../app.states';

import * as dependencyStatusReducer from './dependency-status/dependency-status.reducer';

export const reducers: ActionReducerMap<AppState> = {
  dependencyStatusState: dependencyStatusReducer.depStatusReducer
};

export function logger(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
  return function(state: AppState, action: any): AppState {
    console.log('state', state);
    console.log('action', action);
    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<AppState>[] = !AppConfig.production
  ? [logger]
  : [];

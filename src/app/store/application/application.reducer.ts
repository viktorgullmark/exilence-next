import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ApplicationState } from '../../app.states';
import { ApplicationActions, ApplicationActionTypes } from './application.actions';

export const initialState: ApplicationState = {
  status: {
    snapshotting: false,
    lastSnapshot: undefined,
  },
  session: {
    sessionId: undefined,
    account: undefined,
    league: undefined,
    tradeLeague: undefined
  }
};

export function reducer(
  state = initialState,
  action: ApplicationActions
): ApplicationState {
  switch (action.type) {
    case ApplicationActionTypes.UpdateSnapshotStatus: {
      state.status.snapshotting = action.payload.running;
      return {
        ...state,
        status: state.status
      };
    }

    case ApplicationActionTypes.InitSession: {
      return {
        ...state,
        session: action.payload.session
      };
    }

    default: {
      return state;
    }
  }
}

export const getApplicationState = createFeatureSelector<ApplicationState>('applicationState');
export const selectApplicationStatus = createSelector(getApplicationState,
  (state: ApplicationState) => state.status
);
export const selectApplicationSession = createSelector(getApplicationState,
  (state: ApplicationState) => state.session
);

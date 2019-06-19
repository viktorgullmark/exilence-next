import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ApplicationState } from '../../app.states';
import { ApplicationActions, ApplicationActionTypes } from './application.actions';

export const initialState: ApplicationState = {
  status: {
    snapshotting: false,
    lastSnapshot: undefined,
    selectedTabs: []
  }
};

export function reducer(
  state = initialState,
  action: ApplicationActions
): ApplicationState {
  switch (action.type) {
    case ApplicationActionTypes.UpdateApplication: {
      return {
        ...state,
        status: action.payload.application,
      };
    }

    case ApplicationActionTypes.UpdateSnapshotStatus: {
      state.status.snapshotting = action.payload.running;
      return {
        ...state,
        status: state.status
      };
    }

    default: {
      return state;
    }
  }
}

export const getApplicationState = createFeatureSelector<ApplicationState>('applicationState');
export const selectApplication = createSelector(getApplicationState,
  (state: ApplicationState) => state.status
);

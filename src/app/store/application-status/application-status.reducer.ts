import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ApplicationStatusState } from '../../app.states';
import { ApplicationStatusActions, ApplicationStatusActionTypes } from './application-status.actions';

export const initialState: ApplicationStatusState = {
  status: {
    snapshotting: false,
    lastSnapshot: undefined
  }
};

export function reducer(
  state = initialState,
  action: ApplicationStatusActions
): ApplicationStatusState {
  switch (action.type) {
    case ApplicationStatusActionTypes.UpdateApplicationStatus: {
      return {
        ...state,
        status: action.payload.applicationStatus,
      };
    }

    default: {
      return state;
    }
  }
}

export const getApplicationStatusState = createFeatureSelector<ApplicationStatusState>('applicationStatusState');
export const selectApplicationStatus = createSelector(getApplicationStatusState,
  (state: ApplicationStatusState) => state.status
);

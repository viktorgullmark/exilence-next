import { createFeatureSelector, createSelector } from '@ngrx/store';

import { ApplicationStatusState } from '../../app.states';
import { ApplicationStatusActions, ApplicationStatusActionTypes } from './application-status.actions';
import * as fromAdapter from './application-status.adapter';

export const initialState: ApplicationStatusState = fromAdapter.adapter.getInitialState({
  status: {
    snapshotting: false,
    lastSnapshot: undefined
  }
});

export function reducer(
  state = initialState,
  action: ApplicationStatusActions
): ApplicationStatusState {
  switch (action.type) {
    case ApplicationStatusActionTypes.AddApplicationStatus: {
      return fromAdapter.adapter.addOne(action.payload.applicationStatus, state);
    }

    case ApplicationStatusActionTypes.UpdateApplicationStatus: {
      return fromAdapter.adapter.updateOne(action.payload.applicationStatus, state);
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
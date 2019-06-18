import { createFeatureSelector, createSelector } from '@ngrx/store';

import { DependencyStatusState } from '../../app.states';
import * as fromActions from './dependency-status.actions';
import * as fromAdapter from './dependency-status.adapter';

export const initialState: DependencyStatusState = fromAdapter.adapter.getInitialState({
    ids: ['pathofexile'],
    entities: {
        pathofexile: { name: 'pathofexile', online: false, url: 'www.pathofexile.com' }
    }
});

export function depStatusReducer(state = initialState, action: fromActions.DEPENDENCY_STATUS_ACTIONS): DependencyStatusState {
    switch (action.type) {
        case fromActions.DependencyStatusActionTypes.ADD_DEPENDENCY_STATUS: {
            return fromAdapter.adapter.addOne(action.payload.status, state);
        }
        case fromActions.DependencyStatusActionTypes.UPDATE_DEPENDENCY_STATUS: {
            return fromAdapter.adapter.updateOne(action.payload.status, state);
        }
        default: {
            return state;
        }
    }
}

export const getDepStatusState = createFeatureSelector<DependencyStatusState>('dependencyStatusState');
export const selectDepStatusEntities = createSelector(getDepStatusState, fromAdapter.selectDepStatusEntities);
export const selectAllDepStatuses = createSelector(getDepStatusState, fromAdapter.selectAllDepStatuses);


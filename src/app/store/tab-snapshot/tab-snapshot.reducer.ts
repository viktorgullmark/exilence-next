import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromAdapter from './tab-snapshot.adapter';
import { TabSnapshotActions, TabSnapshotActionTypes } from './tab-snapshot.actions';
import { TabSnapshotsState } from '../../app.states';

export const initialState: TabSnapshotsState = fromAdapter.adapter.getInitialState({
  ids: [],
  entities: {}
});

export function reducer(
  state = initialState,
  action: TabSnapshotActions
): TabSnapshotsState {
  switch (action.type) {
    case TabSnapshotActionTypes.AddTabSnapshot: {
      return fromAdapter.adapter.addOne(action.payload.tabSnapshot, state);
    }

    case TabSnapshotActionTypes.AddTabSnapshots: {
      return fromAdapter.adapter.addMany(action.payload.tabSnapshots, state);
    }
  
    case TabSnapshotActionTypes.DeleteTabSnapshot: {
      return fromAdapter.adapter.removeOne(action.payload.id, state);
    }

    case TabSnapshotActionTypes.LoadTabSnapshots: {
      return fromAdapter.adapter.addAll(action.payload.tabSnapshots, state);
    }

    case TabSnapshotActionTypes.ClearTabSnapshots: {
      return fromAdapter.adapter.removeAll(state);
    }

    default: {
      return state;
    }
  }
}

export const getTabSnapshotsState = createFeatureSelector<TabSnapshotsState>('tabSnapshotsState');
export const selectAllTabSnapshots = createSelector(getTabSnapshotsState, fromAdapter.selectAllTabSnapshots);

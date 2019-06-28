import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NetWorthState } from '../../app.states';
import { NetWorthActions, NetWorthActionTypes } from './net-worth.actions';

export const initialState: NetWorthState = {
  status: {
    snapshotting: false,
    lastSnapshot: undefined,
    tabsLoading: false
  },
  settings: {
    selectedTabs: [],
    tabs: []
  }
};

export function reducer(
  state = initialState,
  action: NetWorthActions
): NetWorthState {
  switch (action.type) {

    case NetWorthActionTypes.LoadTabs: {
      return {
        ...state,
        status: {
          ...state.status,
          tabsLoading: true
        }
      };
    }

    case NetWorthActionTypes.LoadTabsSuccess: {
      return {
        ...state,
        settings: {
          ...state.settings,
          tabs: action.payload.tabs,
        },
        status: {
          ...state.status,
          tabsLoading: false
        }
      };
    }

    case NetWorthActionTypes.LoadTabsFail: {
      return {
        ...state,
        status: {
          ...state.status,
          tabsLoading: false
        }
      };
    }

    case NetWorthActionTypes.UpdateTabSelection: {
      state.settings.selectedTabs = action.payload.tabs;
      return {
        ...state,
        settings: state.settings
      };
    }

    default: {
      return state;
    }
  }
}

export const getNetWorthState = createFeatureSelector<NetWorthState>('netWorthState');
export const selectNetWorthStatus = createSelector(getNetWorthState,
  (state: NetWorthState) => state.status
);

export const selectNetWorthSettings = createSelector(getNetWorthState,
  (state: NetWorthState) => state.settings
);

export const selectNetWorthTabs = createSelector(getNetWorthState,
  (state: NetWorthState) => state.settings.selectedTabs
);

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
    tabs: [],
    tabsLoading: false,
    tradeLeague: undefined
  },
  settings: {
    selectedTabs: undefined
  }
};

export function reducer(
  state = initialState,
  action: ApplicationActions
): ApplicationState {
  switch (action.type) {

    case ApplicationActionTypes.LoadTabs: {
      return {
        ...state,
        session: {
          ...state.session,
          tabsLoading: true
        }
      };
    }

    case ApplicationActionTypes.LoadTabsSuccess: {
      return {
        ...state,
        session: {
          ...state.session,
          tabs: action.payload.tabs,
          tabsLoading: false
        }
      };
    }

    case ApplicationActionTypes.LoadTabsFail: {
      return {
        ...state,
        session: {
          ...state.session,
          tabsLoading: false
        }
      };
    }


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

    case ApplicationActionTypes.UpdateTabSelection: {
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

export const getApplicationState = createFeatureSelector<ApplicationState>('applicationState');
export const selectApplicationStatus = createSelector(getApplicationState,
  (state: ApplicationState) => state.status
);
export const selectApplicationSession = createSelector(getApplicationState,
  (state: ApplicationState) => state.session
);
export const selectApplicationSettings = createSelector(getApplicationState,
  (state: ApplicationState) => state.settings
);

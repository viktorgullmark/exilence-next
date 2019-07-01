
import { NetWorthState } from '../../app.states';
import { NetWorthActions, NetWorthActionTypes } from './net-worth.actions';
import { initialState } from './net-worth.state';


export function reducer(
  state = initialState,
  action: NetWorthActions
): NetWorthState {
  switch (action.type) {

    case NetWorthActionTypes.SetState: {
      return {
        ...state,
        ...action.payload.state
      };
    }

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

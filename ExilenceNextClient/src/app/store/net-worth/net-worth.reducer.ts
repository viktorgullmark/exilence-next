
import { NetWorthState } from '../../app.states';
import { NetWorthActions, NetWorthActionTypes } from './net-worth.actions';
import { initialState } from './net-worth.state';
import * as moment from 'moment';

export function reducer(
  state = initialState,
  action: NetWorthActions
): NetWorthState {
  switch (action.type) {

    case NetWorthActionTypes.OverrideState: {
      return {
        ...state,
        ...action.payload.state,
        status: {
          ...action.payload.state.status,
          snapshotting: false
        }
      };
    }

    case NetWorthActionTypes.LoadStateFromStorage: {
      return {
        ...state
      };
    }

    case NetWorthActionTypes.LoadStateFromStorageSuccess: {
      return {
        ...state
      };
    }

    case NetWorthActionTypes.LoadStateFromStorageFail: {
      return {
        ...state
      };
    }

    case NetWorthActionTypes.AddTabs: {
      return {
        ...state,
        stash: {
          ...state.stash,
          tabs: action.payload.tabs
        }
      };
    }

    case NetWorthActionTypes.FetchItemsForSnapshot: {
      return {
        ...state,
        status: {
          ...state.status,
          snapshotting: true
        }
      };
    }

    case NetWorthActionTypes.FetchItemsForSnapshotSuccess: {
      return {
        ...state,
        stash: {
          ...state.stash,
          tabs: action.payload.tabs
        }
      };
    }

    case NetWorthActionTypes.FetchItemsForSnapshotFail: {
      return {
        ...state,
        status: {
          ...state.status
        }
      };
    }

    case NetWorthActionTypes.PriceItemsForSnapshot: {
      return {
        ...state,
        status: {
          ...state.status
        }
      };
    }

    case NetWorthActionTypes.PriceItemsForSnapshotSuccess: {
      return {
        ...state,
        status: {
          ...state.status,
          snapshotting: false,
          lastSnapshot: moment(new Date()).toDate()
        }
      };
    }

    case NetWorthActionTypes.PriceItemsForSnapshotFail: {
      return {
        ...state,
        status: {
          ...state.status,
          snapshotting: false,
          lastSnapshot: moment(new Date()).toDate()
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

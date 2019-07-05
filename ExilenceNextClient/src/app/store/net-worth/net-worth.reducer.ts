
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

    case NetWorthActionTypes.FetchPrices: {
      return {
        ...state
      };
    }

    case NetWorthActionTypes.FetchPricesSuccess: {
      return {
        ...state,
        prices: {
          ...state.prices,
          poeNinja: action.payload.poeNinja,
          poeWatch: action.payload.poeWatch
        }
      };
    }

    case NetWorthActionTypes.FetchPricesFail: {
      return {
        ...state
      };
    }

    case NetWorthActionTypes.PriceItemsForSnapshot: {
      return {
        ...state
      };
    }

    case NetWorthActionTypes.PriceItemsForSnapshotSuccess: {
      return {
        ...state,
        status: {
          ...state.status,
          snapshotting: false
        },
        stash: {
          ...state.stash,
          tabs: action.payload.tabs
        }
      };
    }
    case NetWorthActionTypes.PriceItemsForSnapshotFail: {
      return {
        ...state,
        status: {
          ...state.status,
          snapshotting: false
        }
      };
    }

    case NetWorthActionTypes.UpdateTabSelection: {
      return {
        ...state,
        settings: {
          ...state.settings,
          selectedTabs: action.payload.tabs
        }
      };
    }


    case NetWorthActionTypes.CreateSnapshot: {
      return {
        ...state
      };
    }

    case NetWorthActionTypes.CreateSnapshotSuccess: {
      return {
        ...state,
        status: {
          ...state.status,
          snapshotting: false,
          lastSnapshot: moment(new Date()).toDate()
        },
        history: {
          ...state.history,
          snapshots: [...state.history.snapshots, action.payload.snapshot]
        }
      };
    }

    case NetWorthActionTypes.CreateSnapshotFail: {
      return {
        ...state,
        status: {
          ...state.status,
          snapshotting: false
        }
      };
    }

    default: {
      return state;
    }
  }
}

import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ApplicationState } from '../../app.states';
import { ApplicationActions, ApplicationActionTypes } from './application.actions';

export const initialState: ApplicationState = {
  session: {
    sessionId: undefined,
    account: undefined,
    league: undefined,
    tradeLeague: undefined,
    loading: false,
    validated: false,
    leagues: [],
    characters: [],
    tabs: []
  }
};

export function reducer(
  state = initialState,
  action: ApplicationActions
): ApplicationState {
  switch (action.type) {

    case ApplicationActionTypes.InitSession: {
      return {
        ...state,
        session: {
          ...state.session,
          loading: true
        }
      };
    }

    case ApplicationActionTypes.SetSession: {
      return {
        ...state,
        session: action.payload.session
      };
    }

    case ApplicationActionTypes.AddCharacters: {
      return {
        ...state,
        session: {
          ...state.session,
          characters: action.payload.characters
        }
      };
    }

    case ApplicationActionTypes.AddLeagues: {
      return {
        ...state,
        session: {
          ...state.session,
          leagues: action.payload.leagues
        }
      };
    }

    case ApplicationActionTypes.AddTabs: {
      return {
        ...state,
        session: {
          ...state.session,
          tabs: action.payload.tabs
        }
      };
    }

    case ApplicationActionTypes.SetLeague: {
      return {
        ...state,
        session: {
          ...state.session,
          league: action.payload.league
        }
      };
    }

    case ApplicationActionTypes.SetTradeLeague: {
      return {
        ...state,
        session: {
          ...state.session,
          tradeLeague: action.payload.tradeLeague
        }
      };
    }

    case ApplicationActionTypes.SetTrialCookie: {
      return {
        ...state
      };
    }

    case ApplicationActionTypes.InitSessionSuccess: {
      return {
        ...state,
        session: {
          ...state.session
        }
      };
    }

    case ApplicationActionTypes.InitSessionFail: {
      return {
        ...state,
        session: {
          ...state.session,
          loading: false
        }
      };
    }

    case ApplicationActionTypes.ValidateSession: {
      return {
        ...state,
        session: {
          ...state.session,
          loading: true
        }
      };
    }

    case ApplicationActionTypes.ValidateSessionSuccess: {
      return {
        ...state,
        session: {
          ...state.session,
          account: action.payload.accountDetails.account,
          sessionId: action.payload.accountDetails.sessionId,
          loading: false,
          validated: true
        }
      };
    }

    case ApplicationActionTypes.ValidateSessionFail: {
      return {
        ...state,
        session: {
          ...state.session,
          loading: false,
          validated: false
        }
      }
    }

    default: {
      return state;
    }
  }
}

export const getApplicationState = createFeatureSelector<ApplicationState>('applicationState');

export const selectApplicationSession = createSelector(getApplicationState,
  (state: ApplicationState) => state.session
);

export const selectApplicationSessionLeagues = createSelector(getApplicationState,
  (state: ApplicationState) => state.session.leagues
);

export const selectApplicationSessionCharacters = createSelector(getApplicationState,
  (state: ApplicationState) => state.session.characters
);

export const selectApplicationSessionTabs = createSelector(getApplicationState,
  (state: ApplicationState) => state.session.tabs
);

export const selectApplicationSessionLoading = createSelector(getApplicationState,
  (state: ApplicationState) => state.session.loading
);

export const selectApplicationSessionValidated = createSelector(getApplicationState,
  (state: ApplicationState) => state.session.validated
);

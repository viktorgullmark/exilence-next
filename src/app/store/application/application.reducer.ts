import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ApplicationState } from '../../app.states';
import { ApplicationActions, ApplicationActionTypes } from './application.actions';

export const initialState: ApplicationState = {
  session: {
    sessionId: undefined,
    account: undefined,
    league: undefined,
    tradeLeague: undefined,
    validating: false,
    loadingLeagues: false
  }
};

export function reducer(
  state = initialState,
  action: ApplicationActions
): ApplicationState {
  switch (action.type) {

    case ApplicationActionTypes.InitSession: {
      return {
        ...state
      };
    }

    case ApplicationActionTypes.ValidateSession: {
      return {
        ...state,
        session: {
          ...state.session,
          validating: true
        }
      };
    }

    case ApplicationActionTypes.ValidateSessionSuccess: {
      return {
        ...state,
        session: {
          ...state.session,
          validating: false
        }
      };
    }

    case ApplicationActionTypes.ValidateSessionFail: {
      return {
        ...state,
        session: {
          ...state.session,
          validating: false
        }
      };
    }

    case ApplicationActionTypes.LoadCharLeagues: {
      return {
        ...state,
        session: {
          ...state.session,
          loadingLeagues: true
        }
      };
    }

    case ApplicationActionTypes.LoadCharLeaguesSuccess: {
      return {
        ...state,
        session: {
          ...state.session,
          loadingLeagues: false
        }
      };
    }

    case ApplicationActionTypes.LoadCharLeaguesFail: {
      return {
        ...state,
        session: {
          ...state.session,
          loadingLeagues: false
        }
      };
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

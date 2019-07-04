import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ApplicationState } from '../../app.states';
import { ApplicationActions, ApplicationActionTypes } from './application.actions';
import { initialState } from './application.state';


export function reducer(
  state = initialState,
  action: ApplicationActions
): ApplicationState {
  switch (action.type) {

    case ApplicationActionTypes.OverrideState: {
      return {
        ...state,
        ...action.payload.state,
        session: {
          ...action.payload.state.session,
          loading: false
        }
      };
    }

    case ApplicationActionTypes.LoadStateFromStorage: {
      return {
        ...state
      };
    }

    case ApplicationActionTypes.LoadStateFromStorageSuccess: {
      return {
        ...state
      };
    }

    case ApplicationActionTypes.LoadStateFromStorageFail: {
      return {
        ...state
      };
    }

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

    case ApplicationActionTypes.AddCharacterLeagues: {
      return {
        ...state,
        session: {
          ...state.session,
          characterLeagues: action.payload.leagues
        }
      };
    }

    case ApplicationActionTypes.AddTradeLeagues: {
      return {
        ...state,
        session: {
          ...state.session,
          tradeLeagues: action.payload.leagues
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

    case ApplicationActionTypes.SetValidateCookieForLogin: {
      return {
        ...state
      };
    }

    case ApplicationActionTypes.SetValidateCookie: {
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

    case ApplicationActionTypes.ValidateSessionForLogin: {
      return {
        ...state,
        session: {
          ...state.session,
          loading: true
        }
      };
    }

    case ApplicationActionTypes.ValidateSessionForLoginSuccess: {
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

    case ApplicationActionTypes.ValidateSessionForLoginFail: {
      return {
        ...state,
        session: {
          ...state.session,
          loading: false,
          validated: false
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
      };
    }

    default: {
      return state;
    }
  }
}

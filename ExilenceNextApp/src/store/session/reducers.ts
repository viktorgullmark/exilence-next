import {
    SessionState,
    INIT_SESSION,
    SessionActionTypes
  } from './types';
  
  const initialState: SessionState = {
    session: undefined
  };
  
  export function sessionReducer(
    state = initialState,
    action: SessionActionTypes
  ): SessionState {
    switch (action.type) {
      case INIT_SESSION:
        return {
          session: {...action.payload}
        };
      default:
        return state;
    }
  }
  
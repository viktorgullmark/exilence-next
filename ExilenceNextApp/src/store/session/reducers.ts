import { ActionType } from 'typesafe-actions';

import * as actions from './actions';
import { INIT_SESSION, SessionState } from './types';

type Action = ActionType<typeof actions>;

const initialState: SessionState = {
  session: undefined
};

export function sessionReducer(
  state = initialState,
  action: Action
): SessionState {
  switch (action.type) {
    case INIT_SESSION:
      return {
        session: { ...action.payload }
      };
    default:
      return state;
  }
}
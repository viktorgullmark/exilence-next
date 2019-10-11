import { Epic } from 'redux-observable';
import { of } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { ActionType, isActionOf } from 'typesafe-actions';

import { AppState } from './../index';
import * as actions from './actions';

type Action = ActionType<typeof actions>;

const initSessionEpic: Epic<Action, Action, AppState> = (action$, store) =>
  action$.pipe(
    filter(isActionOf(actions.initSessionAction)),
    switchMap(action => {
        // testing chain of actions
        return of(actions.initSessionSuccessAction())
      }
    ));

export default [
  initSessionEpic,
];
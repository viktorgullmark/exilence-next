import { Injectable } from '@angular/core';
import { SnapshotService } from '../../auth/net-worth/providers/snapshot.service';
import { Actions, Effect, ofType, createEffect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, EMPTY, of } from 'rxjs';


import * as applicationActions from './application.actions';
import * as notificatonActions from  './../notification/notification.actions'

import { map, mergeMap, catchError, exhaustMap } from 'rxjs/operators';

@Injectable()
export class ApplicationEffects {

  constructor(
    private actions$: Actions,
    private snapshotService: SnapshotService
  ) { }

  startSnapshotting$ = createEffect(() => this.actions$.pipe(
    ofType(applicationActions.ApplicationActionTypes.LoadTabs),
    mergeMap(() => of([])
      .pipe(
        map(tabs => new applicationActions.LoadTabsSuccess({ tabs })),
        catchError((e) => of(new applicationActions.LoadTabsFail({ error: e})))
      ))
    )
  );


}
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { SnapshotService } from '../../auth/net-worth/providers/snapshot.service';
import * as netWorthActions from './net-worth.actions';

@Injectable()
export class NetWorthEffects {

  constructor(
    private actions$: Actions,
    private snapshotService: SnapshotService
  ) { }

  loadTabs$ = createEffect(() => this.actions$.pipe(
    ofType(netWorthActions.NetWorthActionTypes.LoadTabs),
    mergeMap(() => of([])
      .pipe(
        map(tabs => new netWorthActions.LoadTabsSuccess({ tabs })),
        catchError((e) => of(new netWorthActions.LoadTabsFail({ error: e})))
      ))
    )
  );
}

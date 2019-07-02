import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, from, pipe, combineLatest, forkJoin, merge } from 'rxjs';
import { catchError, map, mergeMap, switchMap, flatMap, concatMap } from 'rxjs/operators';
import { SnapshotService } from '../../auth/net-worth/providers/snapshot.service';
import * as netWorthActions from './net-worth.actions';
import { ExternalService } from '../../core/providers/external.service';
import { Stash } from '../../shared/interfaces/stash.interface';
import { PricedItem } from '../../shared/interfaces/priced-item.interface';

@Injectable()
export class NetWorthEffects {

  constructor(
    private actions$: Actions,
    private snapshotService: SnapshotService,
    private externalService: ExternalService
  ) { }

  loadTabs$ = createEffect(() => this.actions$.pipe(
    ofType(netWorthActions.NetWorthActionTypes.LoadTabs),
    mergeMap(() => of([])
      .pipe(
        map(tabs => new netWorthActions.LoadTabsSuccess({ tabs })),
        catchError((e) => of(new netWorthActions.LoadTabsFail({ error: e })))
      ))
  )
  );

  fetchPrices$ = createEffect(() => this.actions$.pipe(
    ofType(netWorthActions.NetWorthActionTypes.FetchPrices),
    mergeMap(() => of([])
      .pipe(
        map(prices => new netWorthActions.FetchPricesSuccess({ prices })),
        catchError((e) => of(new netWorthActions.FetchPricesFail({ error: e })))
      ))
  )
  );

  fetchItemsForSnapshot$ = createEffect(() => this.actions$.pipe(
    ofType(netWorthActions.NetWorthActionTypes.FetchItemsForSnapshot),
    mergeMap((res: any) => 
      this.externalService.getItemsForTabs(res.payload.tabs)
      .pipe(
        map(results => {
          return new netWorthActions.FetchItemsForSnapshotSuccess({ items: [].concat.apply([], results) })
        }),
        catchError((e) => of(new netWorthActions.FetchItemsForSnapshotFail({ error: e })))
      ))
  )
  );

  fetchItemsForSnapshotSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(netWorthActions.NetWorthActionTypes.FetchItemsForSnapshotSuccess),
    map(items => new netWorthActions.PriceItemsForSnapshot({ items: items })))
  );

  priceItemsForSnapshot$ = createEffect(() => this.actions$.pipe(
    ofType(netWorthActions.NetWorthActionTypes.PriceItemsForSnapshot),
    map(() => new netWorthActions.PriceItemsForSnapshotSuccess()))
  );
}

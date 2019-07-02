import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { SnapshotService } from '../../auth/net-worth/providers/snapshot.service';
import { ExternalService } from '../../core/providers/external.service';
import { NotificationType } from '../../shared/enums/notification-type.enum';
import { Notification } from './../../shared/interfaces/notification.interface';
import * as notificationActions from './../notification/notification.actions';
import * as netWorthActions from './net-worth.actions';

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

  // todo: fetch prices for poe watch & poe ninja
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
          catchError(() => of(new netWorthActions.FetchItemsForSnapshotFail(
            { title: 'ERROR.FETCH_ITEMS_UNSUCCESSFUL_TITLE', message: 'ERROR.FETCH_ITEMS_UNSUCCESSFUL_DESC' })))
        ))
  )
  );

  // todo: add notification
  fetchItemsForSnapshotSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(netWorthActions.NetWorthActionTypes.FetchItemsForSnapshotSuccess),
    map(items => new netWorthActions.PriceItemsForSnapshot({ items: items })))
  );

  fetchItemsForSnapshotFail$ = createEffect(() => this.actions$.pipe(
    ofType(netWorthActions.NetWorthActionTypes.FetchItemsForSnapshotFail),
    map((res: any) => new notificationActions.AddNotification({
      notification:
        {
          title: res.payload.title,
          description: res.payload.message,
          type: NotificationType.Error
        } as Notification
    }))
  )
  );

  // todo: price fetched items
  priceItemsForSnapshot$ = createEffect(() => this.actions$.pipe(
    ofType(netWorthActions.NetWorthActionTypes.PriceItemsForSnapshot),
    map(() => new netWorthActions.PriceItemsForSnapshotSuccess()))
  );
}

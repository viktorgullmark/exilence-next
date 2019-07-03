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
import { Tab, Stash } from '../../shared/interfaces/stash.interface';

@Injectable()
export class NetWorthEffects {

  constructor(
    private actions$: Actions,
    private snapshotService: SnapshotService,
    private externalService: ExternalService
  ) { }

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

  fetchTabs$ = createEffect(() => this.actions$.pipe(
    ofType(netWorthActions.NetWorthActionTypes.FetchTabs),
    mergeMap((res: any) =>
      this.externalService.getStashTabs(res.payload.accountDetails.account, res.payload.league)
        .pipe(
          map((stash: Stash) => {
            return new netWorthActions.FetchTabsSuccess({ accountDetails: res.payload.accountDetails, tabs: stash.tabs });
          }),
          catchError(() => of(
            new netWorthActions.FetchTabsFail(
              { title: 'ERROR.FETCH_TABS_FAIL_TITLE', message: 'ERROR.FETCH_TABS_FAIL_DESC' })))
        ))),
  );

  fetchTabsSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(netWorthActions.NetWorthActionTypes.FetchTabsSuccess),
    map((res: any) => new netWorthActions.FetchItemsForSnapshot({ tabs: res.payload.tabs })))
  );

  fetchTabsFail$ = createEffect(() => this.actions$.pipe(
    ofType(netWorthActions.NetWorthActionTypes.FetchTabsFail),
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

  fetchItemsForSnapshot$ = createEffect(() => this.actions$.pipe(
    ofType(netWorthActions.NetWorthActionTypes.FetchItemsForSnapshot),
    mergeMap((res: any) =>
      this.externalService.getItemsForTabs(res.payload.tabs)
        .pipe(
          map(results => {
            return new netWorthActions.FetchItemsForSnapshotSuccess({ tabs: results });
          }),
          catchError(() => of(new netWorthActions.FetchItemsForSnapshotFail(
            { title: 'ERROR.FETCH_ITEMS_FAIL_TITLE', message: 'ERROR.FETCH_ITEMS_FAIL_DESC' })))
        ))
  )
  );

  // todo: add notification
  fetchItemsForSnapshotSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(netWorthActions.NetWorthActionTypes.FetchItemsForSnapshotSuccess),
    map((res: any) => new netWorthActions.PriceItemsForSnapshot({ tabs: res.payload.tabs })))
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

  // todo: price fetched items (wait for prices to be fetched before continuing)
  priceItemsForSnapshot$ = createEffect(() => this.actions$.pipe(
    ofType(netWorthActions.NetWorthActionTypes.PriceItemsForSnapshot),
    map(() => new netWorthActions.PriceItemsForSnapshotSuccess()))
  );
}

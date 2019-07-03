import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { ExternalService } from '../../core/providers/external.service';
import { NotificationType } from '../../shared/enums/notification-type.enum';
import { Stash } from '../../shared/interfaces/stash.interface';
import { Notification } from './../../shared/interfaces/notification.interface';
import * as notificationActions from './../notification/notification.actions';
import * as netWorthActions from './net-worth.actions';
import { NetWorthState } from '../../app.states';
import { StorageMap } from '@ngx-pwa/local-storage';

@Injectable()
export class NetWorthEffects {

  constructor(
    private actions$: Actions,
    private externalService: ExternalService,
    private storageMap: StorageMap
  ) { }

  loadStateFromStorage$ = createEffect(() => this.actions$.pipe(
    ofType(netWorthActions.NetWorthActionTypes.LoadStateFromStorage),
    mergeMap(() => this.storageMap.get('netWorthState').pipe(
      map((state: NetWorthState) =>
        state !== undefined ?
          new netWorthActions.OverrideState({ state }) :
          new netWorthActions.LoadStateFromStorageFail({
            title: 'INFORMATION.NO_STORAGE_TITLE',
            message: 'INFORMATION.NO_STORAGE_DESC'
          })
      )
    ))
  )
  );

  overrideState$ = createEffect(() => this.actions$.pipe(
    ofType(netWorthActions.NetWorthActionTypes.OverrideState),
    map(() => new netWorthActions.LoadStateFromStorageSuccess()))
  );

  loadStateFromStorageFail$ = createEffect(() => this.actions$.pipe(
    ofType(netWorthActions.NetWorthActionTypes.LoadStateFromStorageFail),
    map((res: any) => new notificationActions.AddNotification({
      notification:
        {
          title: res.payload.title,
          description: res.payload.message,
          type: NotificationType.Information
        } as Notification
    }))
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

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, forkJoin } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { ExternalService } from '../../core/providers/external.service';
import { NotificationType } from '../../shared/enums/notification-type.enum';
import { Stash } from '../../shared/interfaces/stash.interface';
import { Notification } from './../../shared/interfaces/notification.interface';
import * as notificationActions from './../notification/notification.actions';
import * as netWorthActions from './net-worth.actions';
import { NetWorthState } from '../../app.states';
import { StorageMap } from '@ngx-pwa/local-storage';
import { PoeNinjaService } from '../../auth/net-worth/providers/poe-ninja.service';
import { PoeWatchService } from '../../auth/net-worth/providers/poe-watch.service';

@Injectable()
export class NetWorthEffects {

  constructor(
    private actions$: Actions,
    private externalService: ExternalService,
    private storageMap: StorageMap,
    private poeNinjaService: PoeNinjaService,
    private poeWatchService: PoeWatchService
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

  // todo: fetch prices for poe ninja / watch
  fetchPrices$ = createEffect(() => this.actions$.pipe(
    ofType(netWorthActions.NetWorthActionTypes.FetchPrices),
    mergeMap((res: any) => forkJoin(
      this.poeNinjaService.getCurrencyPrices(res.payload.league),
      this.poeNinjaService.getItemPrices(res.payload.league),
      this.poeWatchService.getPrices(res.payload.league)
    )
      .pipe(
        map((prices: any) => {
          const ninjaCategories = [].concat.apply([], [prices[0], prices[1]]);
          let ninjaPrices = [];
          ninjaCategories.forEach(cat => {
            ninjaPrices = ninjaPrices.concat(cat);
          });
          return new netWorthActions.FetchPricesSuccess({ poeNinja: ninjaPrices, poeWatch: prices[2] });
        }),
        catchError((e) => of(new netWorthActions.FetchPricesFail(
          { title: 'ERROR.FETCH_PRICES_FAIL_TITLE', message: 'ERROR.FETCH_PRICES_FAIL_DESC' })))
      ))
  )
  );

  fetchTabsForSnapshot$ = createEffect(() => this.actions$.pipe(
    ofType(netWorthActions.NetWorthActionTypes.FetchTabsForSnapshot),
    mergeMap((res: any) =>
      this.externalService.getStashTabs(res.payload.accountDetails.account, res.payload.league)
        .pipe(
          map((stash: Stash) => {
            return new netWorthActions.FetchTabsForSnapshotSuccess({ accountDetails: res.payload.accountDetails, tabs: stash.tabs });
          }),
          catchError(() => of(
            new netWorthActions.FetchTabsForSnapshotFail(
              { title: 'ERROR.FETCH_TABS_FAIL_TITLE', message: 'ERROR.FETCH_TABS_FAIL_DESC' })))
        ))),
  );

  fetchTabsForSnapshotSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(netWorthActions.NetWorthActionTypes.FetchTabsForSnapshotSuccess),
    map((res: any) => new netWorthActions.FetchItemsForSnapshot({ tabs: res.payload.tabs })))
  );

  fetchTabsForSnapshotFail$ = createEffect(() => this.actions$.pipe(
    ofType(netWorthActions.NetWorthActionTypes.FetchTabsForSnapshotFail),
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

  fetchItemsForSnapshotSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(netWorthActions.NetWorthActionTypes.FetchItemsForSnapshotSuccess),
    map((res: any) => new notificationActions.AddNotification({
      notification:
        {
          title: 'INFORMATION.FETCH_ITEMS_SUCCESS_TITLE',
          description: 'INFORMATION.FETCH_ITEMS_SUCCESS_DESC',
          type: NotificationType.Information
        } as Notification
    }))
  )
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

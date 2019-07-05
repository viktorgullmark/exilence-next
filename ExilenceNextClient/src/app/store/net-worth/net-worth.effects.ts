import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { StorageMap } from '@ngx-pwa/local-storage';
import * as moment from 'moment';
import { forkJoin, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { NetWorthState, ApplicationState } from '../../app.states';
import { ItemPricingService } from '../../auth/net-worth/providers/item-pricing.service';
import { PoeNinjaService } from '../../auth/net-worth/providers/poe-ninja.service';
import { PoeWatchService } from '../../auth/net-worth/providers/poe-watch.service';
import { SnapshotService } from '../../auth/net-worth/providers/snapshot.service';
import { ExternalService } from '../../core/providers/external.service';
import { NotificationType } from '../../shared/enums/notification-type.enum';
import { Snapshot } from '../../shared/interfaces/snapshot.interface';
import { Stash } from '../../shared/interfaces/stash.interface';
import { TabSnapshot } from '../../shared/interfaces/tab-snapshot.interface';
import { Notification } from './../../shared/interfaces/notification.interface';
import * as notificationActions from './../notification/notification.actions';
import * as netWorthActions from './net-worth.actions';
import { selectApplicationSessionLeague } from '../application/application.selectors';

@Injectable()
export class NetWorthEffects {

  constructor(
    private actions$: Actions,
    private externalService: ExternalService,
    private storageMap: StorageMap,
    private poeNinjaService: PoeNinjaService,
    private poeWatchService: PoeWatchService,
    private itemPricingService: ItemPricingService,
    private snapshotService: SnapshotService,
    private appStore: Store<ApplicationState>,
    private netWorthStore: Store<NetWorthState>
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
        catchError((e) => {
          console.log(e);
          return of(new netWorthActions.FetchPricesFail(
            { title: 'ERROR.FETCH_PRICES_FAIL_TITLE', message: 'ERROR.FETCH_PRICES_FAIL_DESC' }));
        }))
    ))
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
    map((res: any) => {
      return new netWorthActions.FetchItemsForSnapshot({ tabs: res.payload.tabs });
    }))
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

  priceItemsForSnapshot$ = createEffect(() => this.actions$.pipe(
    ofType(netWorthActions.NetWorthActionTypes.PriceItemsForSnapshot),
    mergeMap((res: any) =>
      this.itemPricingService.priceItemsInTabs(res.payload.tabs, res.payload.prices)
        .pipe(
          map(results => {
            return new netWorthActions.PriceItemsForSnapshotSuccess({ tabs: results });
          }),
          catchError(() => of(new netWorthActions.PriceItemsForSnapshotFail(
            { title: 'ERROR.PRICE_ITEMS_FAIL_TITLE', message: 'ERROR.PRICE_ITEMS_FAIL_DESC' })))
        ))
  )
  );

  priceItemsForSnapshotSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(netWorthActions.NetWorthActionTypes.PriceItemsForSnapshotSuccess),
    map((res: any) => new netWorthActions.CreateSnapshot({ tabs: res.payload.tabs })
    )
  )
  );

  createSnapshot$ = createEffect(() => this.actions$.pipe(
    ofType(netWorthActions.NetWorthActionTypes.CreateSnapshot),
    mergeMap((res: any) => this.appStore.select(selectApplicationSessionLeague)
      .mergeMap((league: string) => of(this.snapshotService.createTabSnapshots(res.payload.tabs))
        .pipe(
          map((tabSnapshots: TabSnapshot[]) => {
            return new netWorthActions.CreateSnapshotSuccess(
              { snapshot: { league: league, timestamp: moment(new Date()).toDate(), tabSnapshots: tabSnapshots } as Snapshot });
          }),
          catchError(() => of(new netWorthActions.CreateSnapshotFail(
            { title: 'ERROR.CREATE_SNAPSHOT_FAIL_TITLE', message: 'ERROR.CREATE_SNAPSHOT_FAIL_DESC' })))
        ))
    ))
  );

}

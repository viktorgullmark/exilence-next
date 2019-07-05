import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of, from, forkJoin } from 'rxjs';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/combineLatest';
import { NotificationType } from '../../../shared/enums/notification-type.enum';
import { NetWorthStatus } from '../../../shared/interfaces/net-worth-status.interface';
import { NotificationsState, NetWorthState } from '../../../app.states';
import { Notification } from '../../../shared/interfaces/notification.interface';
import * as netWorthActions from '../../../store/net-worth/net-worth.actions';
import * as netWorthReducer from '../../../store/net-worth/net-worth.reducer';
import * as notificationActions from '../../../store/notification/notification.actions';
import { selectNetWorthStatus, selectNetWorthStashTabs } from '../../../store/net-worth/net-worth.selectors';
import { ApplicationSession } from '../../../shared/interfaces/application-session.interface';
import { Tab } from '../../../shared/interfaces/stash.interface';
import { selectApplicationSession } from '../../../store/application/application.selectors';
import { ApplicationSessionDetails } from '../../../shared/interfaces/application-session-details.interface';
import { NetWorthEffects } from '../../../store/net-worth/net-worth.effects';
import { ApplicationEffects } from '../../../store/application/application.effects';
import { Actions, ofType } from '@ngrx/effects';
import { ApplicationActionTypes } from '../../../store/application/application.actions';
import { NetWorthActionTypes } from '../../../store/net-worth/net-worth.actions';
import { map } from 'rxjs/operators';
import { PricedItem } from '../../../shared/interfaces/priced-item.interface';
import { Snapshot } from '../../../shared/interfaces/snapshot.interface';
import { TabSnapshot } from '../../../shared/interfaces/tab-snapshot.interface';

@Injectable()
export class SnapshotService {

  private netWorthStatus$: Observable<NetWorthStatus>;
  private netWorthStatus: NetWorthStatus;
  private tabs$: Observable<Tab[]>;
  private tabs: Tab[];
  private session$: Observable<ApplicationSession>;
  private session: ApplicationSession;

  constructor(
    private netWorthStore: Store<NetWorthState>,
    private appStore: Store<ApplicationSession>,
    private actions$: Actions
  ) {

    this.netWorthStatus$ = this.netWorthStore.select(selectNetWorthStatus);
    this.netWorthStatus$.subscribe((status: NetWorthStatus) => {
      this.netWorthStatus = status;
    });

    this.tabs$ = this.netWorthStore.select(selectNetWorthStashTabs);
    this.tabs$.subscribe((tabs: Tab[]) => {
      this.tabs = tabs;
    });

    this.session$ = this.appStore.select(selectApplicationSession);
    this.session$.subscribe((session: ApplicationSession) => {
      this.session = session;
    });

    this.actions$.pipe(ofType(ApplicationActionTypes.ValidateSessionSuccess))
      .combineLatest(this.actions$.pipe(
        ofType(NetWorthActionTypes.LoadStateFromStorageFail,
          NetWorthActionTypes.LoadStateFromStorageSuccess)).first())
      .subscribe(() => {
        this.checkIfReady();
      });
  }

  startSnapshotChain() {
    this.netWorthStore.dispatch(new netWorthActions.FetchTabsForSnapshot({
      tabs: this.tabs,
      accountDetails: { sessionId: this.session.sessionId, account: this.session.account },
      league: this.session.league
    }));
  }

  fetchPrices() {
    this.netWorthStore.dispatch(new netWorthActions.FetchPrices({ league: this.session.tradeLeague }));
  }

  checkIfReady() {
    if (!this.netWorthStatus.snapshotting && this.session.validated) {
      this.startSnapshotChain();
      this.fetchPrices();
    }
  }

  createTabSnapshots(tabs: Tab[]) {
    const tabSnapshots: TabSnapshot[] = [];
    tabs.map((tab: Tab) => {
      let tabValue = 0;
      tab.items.forEach((item: PricedItem) => tabValue += item.value);
      tabSnapshots.push({ tabId: tab.id, value: tabValue} as TabSnapshot);
    });

    return tabSnapshots;
  }
}

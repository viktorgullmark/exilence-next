import { Injectable, OnDestroy } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, Subject, interval, timer } from 'rxjs';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/skipUntil';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/take';
import { NetWorthState } from '../../../app.states';
import { ApplicationSession } from '../../../shared/interfaces/application-session.interface';
import { NetWorthStatus } from '../../../shared/interfaces/net-worth-status.interface';
import { PricedItem } from '../../../shared/interfaces/priced-item.interface';
import { Tab } from '../../../shared/interfaces/stash.interface';
import { TabSnapshot } from '../../../shared/interfaces/tab-snapshot.interface';
import { ApplicationActionTypes } from '../../../store/application/application.actions';
import { selectApplicationSession, selectApplicationSessionLeague } from '../../../store/application/application.selectors';
import * as netWorthActions from '../../../store/net-worth/net-worth.actions';
import { NetWorthActionTypes } from '../../../store/net-worth/net-worth.actions';
import { selectNetWorthStatus, selectTabsByLeague, selectNetWorthSettings } from '../../../store/net-worth/net-worth.selectors';
import { first, exhaust, last, map, take, } from 'rxjs/operators';
import { NetWorthSettings } from '../../../shared/interfaces/net-worth-settings.interface';

@Injectable()
export class SnapshotService implements OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  private killInterval$: Subject<void> = new Subject<void>();
  private netWorthSettings: NetWorthSettings;
  private netWorthSettings$: Observable<NetWorthSettings>;
  private netWorthStatus$: Observable<NetWorthStatus>;
  private netWorthStatus: NetWorthStatus;
  private tabs$: Observable<Tab[]>;
  private tabs: Tab[];
  private session$: Observable<ApplicationSession>;
  private session: ApplicationSession;
  private snapshotTimer: Observable<number>;

  public snapshotCountdown: number;

  constructor(
    private netWorthStore: Store<NetWorthState>,
    private appStore: Store<ApplicationSession>,
    private actions$: Actions
  ) {

    this.actions$.pipe(
      ofType(netWorthActions.NetWorthActionTypes.CreateSnapshotSuccess,
        netWorthActions.NetWorthActionTypes.CreateSnapshotFail)).subscribe(() => {
          if (this.netWorthSettings.automaticSnapshotting) {
            this.startSnapshotTimer();
          }
        });

    this.netWorthSettings$ = this.netWorthStore.select(selectNetWorthSettings).takeUntil(this.destroy$);
    this.netWorthStatus$ = this.netWorthStore.select(selectNetWorthStatus).takeUntil(this.destroy$);
    this.netWorthStatus$.takeUntil(this.destroy$).subscribe((status: NetWorthStatus) => {
      this.netWorthStatus = status;
    });

    this.netWorthSettings$.takeUntil(this.destroy$).subscribe((settings: NetWorthSettings) => {
      this.netWorthSettings = settings;
      if (settings.automaticSnapshotting) {
        this.startSnapshotTimer();
      } else {
        this.snapshotCountdown = -1;
        this.killInterval$.next();
      }
    });

    this.session$ = this.appStore.select(selectApplicationSession).takeUntil(this.destroy$);
    this.session$.takeUntil(this.destroy$).subscribe((session: ApplicationSession) => {
      this.session = session;
    });

    this.appStore.select(selectApplicationSessionLeague).takeUntil(this.destroy$).subscribe((league: string) => {
      this.tabs$ = this.netWorthStore.select(selectTabsByLeague(league));
      this.tabs$.takeUntil(this.destroy$).subscribe((tabs: Tab[]) => {
        this.tabs = tabs;
      });
    });
  }

  startSnapshotTimer() {
    const countdownStart = 30;
    this.snapshotTimer = timer(1000, 1000).pipe(map(i => countdownStart - i), take(countdownStart + 1));

    this.snapshotTimer.takeUntil(this.killInterval$)
      .subscribe((counter) => {
        if (counter === 0) {
          this.snapshot();
        }
        setTimeout(() => {
          this.snapshotCountdown = counter;
        });
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
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

  snapshot() {
    if (!this.netWorthStatus.snapshotting && this.session.validated) {
      this.startSnapshotChain();
      this.fetchPrices();
      this.killInterval$.next();
    }
  }

  createTabSnapshots(tabs: Tab[]) {
    const tabSnapshots: TabSnapshot[] = [];
    tabs.map((tab: Tab) => {
      let tabValue = 0;
      tab.items.forEach((item: PricedItem) => tabValue += item.calculated);
      tabSnapshots.push({ tabId: tab.id, value: tabValue } as TabSnapshot);
    });

    return tabSnapshots;
  }
}

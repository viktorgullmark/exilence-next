import 'rxjs/add/operator/takeUntil';

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material';
import { Store } from '@ngrx/store';
import { StorageMap } from '@ngx-pwa/local-storage';
import * as moment from 'moment';
import { Observable, Subject } from 'rxjs';
import { skip } from 'rxjs/operators';

import { AppState } from '../../../../app.states';
import { SnapshotHelper } from '../../../../shared/helpers/snapshot.helper';
import { ApplicationSession } from '../../../../shared/interfaces/application-session.interface';
import { Snapshot } from '../../../../shared/interfaces/snapshot.interface';
import { Tab } from '../../../../shared/interfaces/stash.interface';
import { TabSnapshotChartData } from '../../../../shared/interfaces/tab-snapshot-chart-data.interface';
import { TabSnapshot } from '../../../../shared/interfaces/tab-snapshot.interface';
import { selectNetWorthSelectedTabs, selectNetWorthStashTabs, selectNetWorthSnapshots } from '../../../../store/net-worth/net-worth.selectors';
import { SnapshotService } from '../../providers/snapshot.service';
import * as netWorthActions from './../../../../store/net-worth/net-worth.actions';
import { ItemPricingService } from '../../providers/item-pricing.service';

@Component({
  selector: 'app-net-worth-page',
  templateUrl: './net-worth-page.component.html',
  styleUrls: ['./net-worth-page.component.scss']
})
export class NetWorthPageComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  public stashtabList$: Observable<Tab[]>;
  public selectedTabs$: Observable<string[]>;
  public snapshots$: Observable<Snapshot[]>;

  private snapshots: Snapshot[];

  public selectedIndex = 0;
  public chartData = { data: [], columnNames: [] } as TabSnapshotChartData;

  @ViewChild('tabGroup', undefined) tabGroup: MatTabGroup;

  constructor(
    private netWorthStore: Store<AppState>,
    private appStore: Store<ApplicationSession>,
    private storageMap: StorageMap,
    private snapshotService: SnapshotService,
    private itemPricingService: ItemPricingService
  ) {
    this.selectedTabs$ = this.netWorthStore.select(selectNetWorthSelectedTabs).takeUntil(this.destroy$);
    this.stashtabList$ = this.netWorthStore.select(selectNetWorthStashTabs).takeUntil(this.destroy$);
    this.snapshots$ = this.netWorthStore.select(selectNetWorthSnapshots).takeUntil(this.destroy$);

    this.snapshots$.subscribe((snapshots: Snapshot[]) => {
      this.snapshots = snapshots;
    });

    // load state from storage
    this.appStore.dispatch(new netWorthActions.LoadStateFromStorage());

    // save state to storage on changes
    this.netWorthStore.pipe(skip(1)).subscribe((state: AppState) => {
      this.storageMap.set('netWorthState', state.netWorthState).subscribe();
    });

  }

  ngOnInit() {
    this.selectedTabs$.subscribe((ids: string[]) => {
      if (this.snapshots !== undefined) {
        this.chartData = SnapshotHelper.formatSnapshotsForChart(ids, this.snapshots);
        window.dispatchEvent(new Event('resize'));
      }
    });

    this.tabGroup.selectedIndexChange.takeUntil(this.destroy$).subscribe((res: number) => {
      window.dispatchEvent(new Event('resize'));
    });
  }

  tabsChanged(tabs: string[]) {
    this.netWorthStore.dispatch(new netWorthActions.UpdateTabSelection({
      tabs: tabs
    }));
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}

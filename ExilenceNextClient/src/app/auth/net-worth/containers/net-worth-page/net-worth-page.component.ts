import 'rxjs/add/operator/takeUntil';

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material';
import { Store } from '@ngrx/store';
import { StorageMap } from '@ngx-pwa/local-storage';
import * as moment from 'moment';
import { Observable, Subject } from 'rxjs';
import { skip, map } from 'rxjs/operators';

import { AppState } from '../../../../app.states';
import { SnapshotHelper } from '../../../../shared/helpers/snapshot.helper';
import { ApplicationSession } from '../../../../shared/interfaces/application-session.interface';
import { Snapshot } from '../../../../shared/interfaces/snapshot.interface';
import { Tab, CompactTab } from '../../../../shared/interfaces/stash.interface';
import { TabSnapshot } from '../../../../shared/interfaces/tab-snapshot.interface';
import { selectNetWorthSelectedTabs, selectNetWorthStashTabs, selectNetWorthSnapshots, selectCompactTabsByIds } from '../../../../store/net-worth/net-worth.selectors';
import { SnapshotService } from '../../providers/snapshot.service';
import * as netWorthActions from './../../../../store/net-worth/net-worth.actions';
import { ItemPricingService } from '../../providers/item-pricing.service';
import { ChartSeries } from '../../../../shared/interfaces/chart.interface';
import { ColourHelper } from '../../../../shared/helpers/colour.helper';

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
  private selectedCompactTabs: CompactTab[];

  public selectedIndex = 0;
  public chartData: ChartSeries[] = [];
  public colorScheme = {
    domain: ['#e91e63', '#f2f2f2', '#FFEE93', '#8789C0', '#45F0DF'] };

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
      if (this.selectedCompactTabs !== undefined) {
        this.chartData = SnapshotHelper.formatSnapshotsForChart(this.selectedCompactTabs, this.snapshots);
      }
    });

    // load state from storage
    this.appStore.dispatch(new netWorthActions.LoadStateFromStorage());

    // save state to storage on changes
    this.netWorthStore.pipe(skip(1)).subscribe((state: AppState) => {
      this.storageMap.set('netWorthState', state.netWorthState).subscribe();
    });

  }

  ngOnInit() {
    // map tab snapshots to chart
    this.selectedTabs$.subscribe((ids: string[]) => {
      if (ids.length > 0) {
        this.netWorthStore
          .select(selectCompactTabsByIds(ids))
          .pipe(map((tabs: Tab[]) => {
            return tabs.map((tab: Tab) => { return { id: tab.id, n: tab.n, colour: tab.colour, i: tab.i } as CompactTab })
          }))
          .takeUntil(this.destroy$)
          .subscribe((tabs: CompactTab[]) => {
            this.colorScheme.domain = []
            tabs.map(tab => this.colorScheme.domain.push(ColourHelper.rgbToHex(tab.colour.r, tab.colour.g, tab.colour.b)));

            this.selectedCompactTabs = tabs;
            if (this.snapshots !== undefined) {
              this.chartData = SnapshotHelper.formatSnapshotsForChart(tabs, this.snapshots);
            }
          });
      }
    });

    this.tabGroup.selectedIndexChange.takeUntil(this.destroy$).subscribe((res: number) => {
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

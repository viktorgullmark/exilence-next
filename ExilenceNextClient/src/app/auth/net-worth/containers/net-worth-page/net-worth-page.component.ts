import 'rxjs/add/operator/takeUntil';

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material';
import { Store } from '@ngrx/store';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Observable, Subject, of, timer } from 'rxjs';
import { map, skip, debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import 'rxjs/add/operator/switchMap';
import { AppState } from '../../../../app.states';
import { ColourHelper } from '../../../../shared/helpers/colour.helper';
import { SnapshotHelper } from '../../../../shared/helpers/snapshot.helper';
import { ApplicationSession } from '../../../../shared/interfaces/application-session.interface';
import { ChartSeries } from '../../../../shared/interfaces/chart.interface';
import { Snapshot } from '../../../../shared/interfaces/snapshot.interface';
import { CompactTab, Tab } from '../../../../shared/interfaces/stash.interface';
import { TabSelection } from '../../../../shared/interfaces/tab-selection.interface';
import { selectApplicationSessionLeague, selectApplicationSessionModuleIndex } from '../../../../store/application/application.selectors';
import {
  selectSnapshotsByLeague,
  selectTabsByIds,
  selectTabsByLeague,
  selectTabSelectionByLeague,
} from '../../../../store/net-worth/net-worth.selectors';
import { ItemPricingService } from '../../providers/item-pricing.service';
import { SnapshotService } from '../../providers/snapshot.service';
import * as netWorthActions from './../../../../store/net-worth/net-worth.actions';
import * as applicationActions from './../../../../store/application/application.actions';
import { StorageService } from '../../../../core/providers/storage.service';
import { TableHelper } from '../../../../shared/helpers/table.helper';
import { PricedItem } from '../../../../shared/interfaces/priced-item.interface';
import { NetWorthItemTableComponent } from '../../components/net-worth-item-table/net-worth-item-table.component';
import { TableItem } from '../../../../shared/interfaces/table-item.interface';

@Component({
  selector: 'app-net-worth-page',
  templateUrl: './net-worth-page.component.html',
  styleUrls: ['./net-worth-page.component.scss']
})
export class NetWorthPageComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  tabChanged$: Subject<boolean> = new Subject<boolean>();

  public stashtabList$: Observable<Tab[]>;
  public selectedTabs$: Observable<TabSelection[]>;
  public snapshots$: Observable<Snapshot[]>;
  public playerList$: Observable<any[]> = of([]);
  public moduleIndex$: Observable<number>;
  public selectedTabsWithItems$: Observable<Tab[]>;

  private snapshots: Snapshot[] = [];
  private selectedCompactTabs: CompactTab[];
  private selectedLeague: string;

  public graphLoading = false;
  public selectedIndex = 0;
  public chartData: ChartSeries[] = [];
  public tableData: TableItem[] = [];
  public colorScheme = {
    domain: ['#e91e63', '#f2f2f2', '#FFEE93', '#8789C0', '#45F0DF']
  };

  @ViewChild('tabGroup', undefined) tabGroup: MatTabGroup;
  @ViewChild(NetWorthItemTableComponent, undefined) itemTable: NetWorthItemTableComponent;

  constructor(
    private netWorthStore: Store<AppState>,
    private appStore: Store<ApplicationSession>,
    private storageMap: StorageMap,
    private snapshotService: SnapshotService,
    private itemPricingService: ItemPricingService,
    private storageService: StorageService
  ) {

    this.appStore.select(selectApplicationSessionLeague).takeUntil(this.destroy$).subscribe((league: string) => {
      this.selectedLeague = league;
      this.snapshots$ = this.netWorthStore.select(selectSnapshotsByLeague(league)).takeUntil(this.destroy$);
      this.selectedTabs$ = this.netWorthStore.select(selectTabSelectionByLeague(league)).takeUntil(this.destroy$);
      this.stashtabList$ = this.netWorthStore.select(selectTabsByLeague(league)).takeUntil(this.destroy$);
    });

    this.moduleIndex$ = this.appStore.select(selectApplicationSessionModuleIndex).takeUntil(this.destroy$);

    this.snapshots$.takeUntil(this.destroy$).subscribe((snapshots: Snapshot[]) => {
      this.snapshots = snapshots;
      if (this.selectedCompactTabs !== undefined) {
        this.chartData = SnapshotHelper.formatSnapshotsForChart(this.selectedCompactTabs, this.snapshots);
      }

      // todo: update item table
    });

    // load state from storage
    if (!this.storageService.netWorthLoaded) {
      this.appStore.dispatch(new netWorthActions.LoadStateFromStorage());
    }
    // save state to storage on changes
    this.netWorthStore.pipe(skip(1)).takeUntil(this.destroy$).subscribe((state: AppState) => {
      this.storageMap.set('netWorthState', state.netWorthState).takeUntil(this.destroy$).subscribe();
    });
  }

  ngOnInit() {
    this.selectedTabs$.pipe(distinctUntilChanged()).takeUntil(this.destroy$)
      .mergeMap((selectedTabs: TabSelection[]) => {
        return this.netWorthStore
          .select(selectTabsByIds(selectedTabs.map(tab => tab.tabId)))
          .pipe(
            filter(tabs => tabs.length !== 0),
            map((tabs: Tab[]) => {
              return tabs.map((tab: Tab) => {
                return { id: tab.id, n: tab.n, colour: tab.colour, i: tab.i } as CompactTab;
              }
              );
            }))
          .mergeMap((tabs: CompactTab[]) => {
            this.updateColorSchemeFromCompactTabs(tabs);
            return this.netWorthStore.select(selectTabsByIds(selectedTabs.map(t => t.tabId)));
          });
      }).subscribe((tabs: Tab[]) => {
        this.chartData = SnapshotHelper.formatSnapshotsForChart(tabs, this.snapshots);
        this.tableData = TableHelper.formatTabsForTable(tabs);
        this.itemTable.updateTable(this.tableData);
      });

    this.tabGroup.selectedIndexChange.takeUntil(this.destroy$).subscribe((index: number) => {
      if (index === 0) {
        this.graphLoading = true;
        timer(2000).takeUntil(this.tabChanged$)
          .pipe(
            switchMap(() => of(this.graphLoading = false))
          ).subscribe();

        window.dispatchEvent(new Event('resize'));
      } else {
        this.tabChanged$.next(true);
      }
      this.appStore.dispatch(new applicationActions.SetModuleIndex({ index: index }));
    });
  }

  tabsChanged(tabIds: string[]) {
    const selectedTabs = tabIds.map(id => {
      return { tabId: id, league: this.selectedLeague } as TabSelection;
    });
    this.netWorthStore.dispatch(new netWorthActions.UpdateTabSelection({
      tabs: selectedTabs,
      league: this.selectedLeague
    }));
  }

  updateColorSchemeFromCompactTabs(tabs: CompactTab[]) {
    this.colorScheme.domain = [];
    tabs.map(tab => this.colorScheme.domain.push(ColourHelper.rgbToHex(tab.colour.r, tab.colour.g, tab.colour.b)));
    this.selectedCompactTabs = tabs;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}

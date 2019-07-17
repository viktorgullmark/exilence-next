import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelectChange } from '@angular/material';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { Observable, Subject } from 'rxjs';

import { NetWorthState } from '../../../../app.states';
import { NetWorthSettings } from '../../../../shared/interfaces/net-worth-settings.interface';
import { NetWorthStatus } from '../../../../shared/interfaces/net-worth-status.interface';
import { Snapshot } from '../../../../shared/interfaces/snapshot.interface';
import { Tab } from '../../../../shared/interfaces/stash.interface';
import { TabSelection } from '../../../../shared/interfaces/tab-selection.interface';
import { selectNetWorthStatus, selectTabSelectionByLeague } from '../../../../store/net-worth/net-worth.selectors';
import { SnapshotService } from '../../providers/snapshot.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  @Input() stashtabList$: Observable<Tab[]>;
  @Input() netWorthSettings$: Observable<NetWorthSettings>;
  @Input() selectedLeague$: Observable<string>;
  @Input() selectedTabs$: Observable<TabSelection[]>;
  @Input() playerList$: Observable<any[]>;
  @Input() moduleIndex$: Observable<number>;
  @Input() selectedTabsValue$: Observable<number>;
  @Input() totalValue$: Observable<number>;
  @Input() lastSnapshot$: Observable<Snapshot>;
  @Input() leagues$: Observable<string[]>;

  @Output() tabSelectionChanged: EventEmitter<string[]> = new EventEmitter;
  @Output() leagueSelectionChanged: EventEmitter<string> = new EventEmitter;

  public stashtabs = new FormControl();
  public leagues = new FormControl();
  public players = new FormControl();
  public status$: Observable<NetWorthStatus>;

  public selection: any;

  constructor(public router: Router, private netWorthStore: Store<NetWorthState>,
    public snapshotService: SnapshotService) {
    this.status$ = this.netWorthStore.select(selectNetWorthStatus).takeUntil(this.destroy$);
  }

  ngOnInit() {
    this.selectedTabs$.takeUntil(this.destroy$).subscribe(tabs => {
      this.stashtabs.setValue(tabs.map(tab => tab.tabId));
    });

    this.selectedLeague$.takeUntil(this.destroy$).mergeMap(league => {
      this.leagues.setValue(league);
      return this.netWorthStore.select(selectTabSelectionByLeague(league)).takeUntil(this.destroy$);
    }).subscribe((res: any) => {
      this.stashtabs.setValue(res.map(tab => tab.tabId));
    });

  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  tabsChanged(event: MatSelectChange) {
    this.tabSelectionChanged.emit(event.value);
  }

  leagueChanged(event: MatSelectChange) {
    this.leagueSelectionChanged.emit(event.value);
  }

  getFromNow(snapshot: Snapshot) {
    if (snapshot !== undefined) {
      return moment(snapshot.timestamp).fromNow();
    }
  }

  isSelected(selection: TabSelection[], id: string) {
    return selection.find(s => s.tabId === id) !== undefined;
  }

  doSnapshot() {
    this.snapshotService.snapshot();
  }

}

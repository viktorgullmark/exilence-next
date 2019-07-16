import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { Observable, Subject } from 'rxjs';

import { Tab } from '../../../../shared/interfaces/stash.interface';
import { TabSelection } from '../../../../shared/interfaces/tab-selection.interface';
import { MatSelectChange } from '@angular/material';
import { Router } from '@angular/router';
import * as netWorthActions from '../../../../store/net-worth/net-worth.actions';
import { selectNetWorthStatus } from '../../../../store/net-worth/net-worth.selectors';
import { NetWorthState } from '../../../../app.states';
import { NetWorthStatus } from '../../../../shared/interfaces/net-worth-status.interface';
import { Store } from '@ngrx/store';
import { SnapshotService } from '../../providers/snapshot.service';
import { Snapshot } from '../../../../shared/interfaces/snapshot.interface';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  @Input() stashtabList$: Observable<Tab[]>;
  @Input() selectedTabs$: Observable<TabSelection[]>;
  @Input() playerList$: Observable<any[]>;
  @Input() moduleIndex$: Observable<number>;
  @Input() selectedTabsValue$: Observable<number>;
  @Input() totalValue$: Observable<number>;
  @Input() lastSnapshot$: Observable<Snapshot>;
  @Output() tabSelectionChanged: EventEmitter<string[]> = new EventEmitter;

  public stashtabs = new FormControl();
  public players = new FormControl();
  public status$: Observable<NetWorthStatus>;

  public selection: any;

  constructor(public router: Router, private netWorthStore: Store<NetWorthState>,
    private snapshotService: SnapshotService) {
    this.status$ = this.netWorthStore.select(selectNetWorthStatus).takeUntil(this.destroy$);
  }

  ngOnInit() {
    this.selectedTabs$.takeUntil(this.destroy$).subscribe(tabs => {
      this.stashtabs.setValue(tabs.map(tab => tab.tabId));
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  tabsChanged(event: MatSelectChange) {
    this.tabSelectionChanged.emit(event.value);
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

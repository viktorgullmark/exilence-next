import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { Observable } from 'rxjs';

import { Tab } from '../../../../shared/interfaces/stash.interface';
import { TabSelection } from '../../../../shared/interfaces/tab-selection.interface';
import { MatSelectChange } from '@angular/material';
import { Router } from '@angular/router';
import * as netWorthActions from '../../../../store/net-worth/net-worth.actions';
import { selectNetWorthStatus } from '../../../../store/net-worth/net-worth.selectors';
import { NetWorthState } from '../../../../app.states';
import { NetWorthStatus } from '../../../../shared/interfaces/net-worth-status.interface';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {
  @Input() stashtabList$: Observable<Tab[]>;
  @Input() selectedTabs$: Observable<TabSelection[]>;
  @Input() playerList$: Observable<any[]>;
  @Input() moduleIndex$: Observable<number>;
  @Output() tabSelectionChanged: EventEmitter<string[]> = new EventEmitter;

  public stashtabs = new FormControl();
  public players = new FormControl();
  public status$: Observable<NetWorthStatus>;

  constructor(public router: Router, private netWorthStore: Store<NetWorthState>) {
    this.status$ = this.netWorthStore.select(selectNetWorthStatus);
  }

  ngOnInit() {
    this.selectedTabs$.subscribe(tabs => {
      this.stashtabs.setValue(tabs.map(tab => tab.tabId));
    });
  }

  tabsChanged(event: MatSelectChange) {
    this.tabSelectionChanged.emit(event.value);
  }

}

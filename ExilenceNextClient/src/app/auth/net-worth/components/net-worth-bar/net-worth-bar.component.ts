import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { Observable } from 'rxjs';

import { Tab } from '../../../../shared/interfaces/stash.interface';
import { TabSelection } from '../../../../shared/interfaces/tab-selection.interface';
import { MatSelectChange } from '@angular/material';

@Component({
  selector: 'app-net-worth-bar',
  templateUrl: './net-worth-bar.component.html',
  styleUrls: ['./net-worth-bar.component.scss']
})
export class NetWorthBarComponent implements OnInit {
  @Input() stashtabList$: Observable<Tab[]>;
  @Input() selectedTabs$: Observable<TabSelection[]>;
  @Input() playerList$: Observable<any[]>;
  @Output() tabSelectionChanged: EventEmitter<string[]> = new EventEmitter;

  public stashtabs = new FormControl();
  public players = new FormControl();

  constructor() { }

  ngOnInit() {
    this.selectedTabs$.subscribe(tabs => {
      this.stashtabs.setValue(tabs.map(tab => tab.tabId));
    });
  }

  tabsChanged(event: MatSelectChange) {
    this.tabSelectionChanged.emit(event.value);
  }

}

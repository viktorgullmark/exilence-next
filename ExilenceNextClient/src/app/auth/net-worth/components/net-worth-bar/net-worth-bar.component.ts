import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MatSelectChange } from '@angular/material';
import { Observable } from 'rxjs';
import { Tab } from '../../../../shared/interfaces/stash.interface';
import { TabSelection } from '../../../../shared/interfaces/tab-selection.interface';

@Component({
  selector: 'app-net-worth-bar',
  templateUrl: './net-worth-bar.component.html',
  styleUrls: ['./net-worth-bar.component.scss']
})
export class NetWorthBarComponent implements OnInit {
  @Input() stashtabList$: Observable<Tab[]>;
  @Input() selectedTabs$: Observable<TabSelection[]>;
  @Output() tabSelectionChanged: EventEmitter<string[]> = new EventEmitter;

  constructor() { }

  ngOnInit() {
  }

  tabsChanged(tabs: string[]) {
    this.tabSelectionChanged.emit(tabs);
  }

}

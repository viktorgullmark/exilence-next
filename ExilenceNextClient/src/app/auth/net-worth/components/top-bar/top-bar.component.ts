import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { Observable } from 'rxjs';

import { Tab } from '../../../../shared/interfaces/stash.interface';
import { TabSelection } from '../../../../shared/interfaces/tab-selection.interface';
import { MatSelectChange } from '@angular/material';
import { Router } from '@angular/router';

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

  constructor(public router: Router) { }

  ngOnInit() {
    this.selectedTabs$.subscribe(tabs => {
      this.stashtabs.setValue(tabs.map(tab => tab.tabId));
    });
  }

  tabsChanged(event: MatSelectChange) {
    this.tabSelectionChanged.emit(event.value);
  }

}

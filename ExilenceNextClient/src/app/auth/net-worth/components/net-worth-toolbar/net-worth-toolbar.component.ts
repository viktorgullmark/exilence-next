import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { MatSelectChange } from '@angular/material';
import { Observable } from 'rxjs';
import { Tab } from '../../../../shared/interfaces/stash.interface';
import { AppState } from '../../../../app.states';
import { Store } from '@ngrx/store';
import { ApplicationSession } from '../../../../shared/interfaces/application-session.interface';
import * as applicationActions from '../../../../store/application/application.actions';
import * as applicationReducer from '../../../../store/application/application.reducer';

@Component({
  selector: 'app-net-worth-toolbar',
  templateUrl: './net-worth-toolbar.component.html',
  styleUrls: ['./net-worth-toolbar.component.scss']
})
export class NetWorthToolbarComponent implements OnInit {
  public startDate = new FormControl(moment());
  public endDate = new FormControl(moment());
  public stashtabs = new FormControl();

  @Input() selectedTabs$: Observable<string[]>;
  @Input() stashtabList$: Observable<Tab[]>;
  @Output() tabSelectionChanged: EventEmitter<string[]> = new EventEmitter;

  constructor() {
  }

  ngOnInit() {
    this.selectedTabs$.subscribe(tabs => {
      this.stashtabs.setValue(tabs);
    });
  }

  selectedTab(event: MatSelectChange) {
    this.tabSelectionChanged.emit(event.value);
  }

}

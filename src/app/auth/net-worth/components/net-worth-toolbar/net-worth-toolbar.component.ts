import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { MatSelectChange } from '@angular/material';

@Component({
  selector: 'app-net-worth-toolbar',
  templateUrl: './net-worth-toolbar.component.html',
  styleUrls: ['./net-worth-toolbar.component.scss']
})
export class NetWorthToolbarComponent implements OnInit {
  public startDate = new FormControl(moment());
  public endDate = new FormControl(moment());
  // todo: remove mock data
  public stashtabList = ['stashtab1', 'stashtab2'];
  public stashtabs = new FormControl();

  @Output() tabSelectionChanged: EventEmitter<string[]> = new EventEmitter;

  constructor() { }

  ngOnInit() {
  }

  selectedTab(event: MatSelectChange) {
    this.tabSelectionChanged.emit(event.value);
  }

}

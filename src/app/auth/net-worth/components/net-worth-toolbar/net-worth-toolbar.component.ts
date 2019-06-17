import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-net-worth-toolbar',
  templateUrl: './net-worth-toolbar.component.html',
  styleUrls: ['./net-worth-toolbar.component.scss']
})
export class NetWorthToolbarComponent implements OnInit {
  public startDate = new FormControl(moment());
  public endDate = new FormControl(moment());
  public stashtabList = [];
  public stashtabs = new FormControl();
  constructor() { }

  ngOnInit() {
  }

}

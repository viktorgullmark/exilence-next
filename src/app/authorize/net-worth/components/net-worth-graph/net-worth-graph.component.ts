import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ChartSeries, ChartSeriesEntry } from '../../../../shared/interfaces/chart.interface';

@Component({
  selector: 'app-net-worth-graph',
  templateUrl: './net-worth-graph.component.html',
  styleUrls: ['./net-worth-graph.component.scss']
})
export class NetWorthGraphComponent implements OnInit {
  // todo: remove mock data
  public data = [{
    name: 'stashtab1', series: [{
      name: moment(new Date()).subtract(1, 'days').toDate(),
      value: 0.5
    }, {
      name: moment().toDate(),
      value: 1.5
    }, {
      name: moment(new Date()).add(1, 'days').toDate(),
      value: 5
    }]
  },
  {
    name: 'stashtab2', series: [{
      name: moment(new Date()).subtract(1, 'days').toDate(),
      value: 2
    }, {
      name: moment().toDate(),
      value: 5.2
    }, {
      name: moment(new Date()).add(1, 'days').toDate(),
      value: 8
    }]
  }];

  public colorScheme = {
    domain: ['#e91e63', '#f2f2f2', '#FFEE93', '#8789C0', '#45F0DF']
  };

  constructor() {
  }

  ngOnInit() {
  }

  axisFormat(val) {
    return moment(val).format('MM-DD, LT');
  }
}

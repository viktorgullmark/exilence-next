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

  public data = [
    ['London', 8136000],
    ['New York', 8538000],
    ['Paris', 2244000],
    ['Berlin', 3470000],
    ['Kairo', 19500000],
  ];

  options = {
    colors: ['#e91e63', '#fff'],
    is3D: true,
    backgroundColor: {
      fill: 'none',
      stroke: '#fff'
    },
    hAxis: {
      textStyle: { color: '#fff' }
    },
    vAxis: {
      textStyle: { color: '#fff' }
    },
    legend: {
      textStyle: { color: '#fff' }
    }
  };
  // moment(new Date()).add(1, 'days').toDate()   #e91e63

  constructor() {
  }

  ngOnInit() {
  }

  axisFormat(val) {
    return moment(val).format('MM-DD, LT');
  }
}

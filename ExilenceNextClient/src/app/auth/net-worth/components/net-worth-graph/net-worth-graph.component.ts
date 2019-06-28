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
    [1, 100, 90, 110, 85, 96, 104, 120],
    [2, 120, 95, 130, 90, 113, 124, 140],
    [3, 130, 105, 140, 100, 117, 133, 139],
    [4, 90, 85, 95, 85, 88, 92, 95],
    [5, 70, 74, 63, 67, 69, 70, 72],
    [6, 30, 39, 22, 21, 28, 34, 40],
    [7, 80, 77, 83, 70, 77, 85, 90],
    [8, 100, 90, 110, 85, 95, 102, 110]
  ];

  options = {
    colors: ['#e91e63', '#fff'],
    is3D: true,
    backgroundColor: {
      fill: 'none',
      stroke: '#fff'
    },
    hAxis: {
      textStyle: { color: '#fff' },
      gridlines: { color: '#303030' },
      minorGridlines: { color: '#303030' }
    },
    vAxis: {
      textStyle: { color: '#fff' },
      gridlines: { color: '#303030' },
      minorGridlines: { color: '#303030' }
    },
    legend: 'none',
    chartArea: { width: '90%', height: '85%' },
    curveType: 'function',
    series: [{ 'color': '#e91e63' }],
    intervals: { style: 'bars', color: '#fff' },
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

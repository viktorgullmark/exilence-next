import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ChartSeries } from '../../../../shared/interfaces/chart.interface';

@Component({
  selector: 'app-net-worth-graph',
  templateUrl: './net-worth-graph.component.html',
  styleUrls: ['./net-worth-graph.component.scss']
})
export class NetWorthGraphComponent implements OnInit {
  @Input() loading: boolean;
  @Input() tabChartData: ChartSeries[] = [];
  @Input() playerChartData: ChartSeries[] = [];
  @Input() colorScheme = {
    domain: ['#e91e63', '#fff']
  };

  public defaultColorScheme = {
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

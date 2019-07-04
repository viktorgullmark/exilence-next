import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ChartSeries } from '../../../../shared/interfaces/chart.interface';

@Component({
  selector: 'app-net-worth-graph',
  templateUrl: './net-worth-graph.component.html',
  styleUrls: ['./net-worth-graph.component.scss']
})
export class NetWorthGraphComponent implements OnInit {
  @Input() chartData: ChartSeries[] = [];

  @Input() colorScheme = {
    domain: ['#e91e63', '#fff'] };

  constructor() {
  }

  ngOnInit() {
  }

  axisFormat(val) {
    return moment(val).format('MM-DD, LT');
  }
}

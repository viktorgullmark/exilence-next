import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { ItemHelper } from './../../../../shared/helpers/item.helper';

@Component({
  selector: 'app-net-worth-item-table',
  templateUrl: './net-worth-item-table.component.html',
  styleUrls: ['./net-worth-item-table.component.scss']
})
export class NetWorthItemTableComponent implements OnInit {

  @ViewChild(MatSort, undefined) sort: MatSort;
  @ViewChild(MatPaginator, undefined) paginator: MatPaginator;

  public pageSizeOptions: number[] = [5, 10, 25, 100];
  public displayedColumns: string[] = ['icon', 'name', 'tab', 'links', 'quality', 'gemLevel', 'corrupted',
    'stacksize', 'valuePerUnit', 'value'];

  // todo: remove mock data
  public dataSource = new MatTableDataSource([
    {
      icon: 'https://via.placeholder.com/150', name: 'item name', tab: 'stashtab1', links: 3, quality: 15, gemLevel: 3, corrupted: true,
      stacksize: 7, totalStacksize: 3, valuePerUnit: 6, value: 12, frameType: 1
    }, {
      icon: 'https://via.placeholder.com/150', name: 'item name', tab: 'stashtab1, stashtab2', links: 6, quality: 15, gemLevel: 3,
      corrupted: true, stacksize: 7, totalStacksize: 15, valuePerUnit: 5.5, value: 15, frameType: 2
    }, {
      icon: 'https://via.placeholder.com/150', name: 'item name', tab: 'stashtab1', links: 0, quality: 15, gemLevel: 3, corrupted: false,
      stacksize: 7, totalStacksize: 10, valuePerUnit: 4.25, value: 15, frameType: 2
    }, {
      icon: 'https://via.placeholder.com/150', name: 'item name', tab: 'stashtab1', links: 3, quality: 15, gemLevel: 3, corrupted: false,
      stacksize: 7, totalStacksize: 10, valuePerUnit: 5.5, value: 14, frameType: 3
    }, {
      icon: 'https://via.placeholder.com/150', name: 'item name', tab: 'stashtab1', links: undefined, quality: 15, gemLevel: undefined,
      corrupted: true, stacksize: 7, totalStacksize: 10, valuePerUnit: 5.5, value: 15, frameType: 4
    },
  ]);

  constructor() { }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  isDivinationCard(icon: string) {
    return ItemHelper.isDivinationCard(icon);
  }
}

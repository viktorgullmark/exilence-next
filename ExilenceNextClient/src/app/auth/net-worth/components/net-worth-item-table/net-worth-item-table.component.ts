import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { ItemHelper } from './../../../../shared/helpers/item.helper';
import { Observable } from 'rxjs';
import { Tab, CompactTab } from '../../../../shared/interfaces/stash.interface';
import { TabSelection } from '../../../../shared/interfaces/tab-selection.interface';
import { PricedItem } from '../../../../shared/interfaces/priced-item.interface';
import { TableItem } from '../../../../shared/interfaces/table-item.interface';
import { TableHelper } from '../../../../shared/helpers/table.helper';

@Component({
  selector: 'app-net-worth-item-table',
  templateUrl: './net-worth-item-table.component.html',
  styleUrls: ['./net-worth-item-table.component.scss']
})
export class NetWorthItemTableComponent implements OnInit {
  @Input() tableData: TableItem[];

  @ViewChild(MatSort, undefined) sort: MatSort;
  @ViewChild(MatPaginator, undefined) paginator: MatPaginator;

  public stashtabs$: Observable<Tab[]>;
  public pageSizeOptions: number[] = [5, 10, 25, 100];
  public displayedColumns: string[] = ['icon', 'name', 'tab', 'links', 'quality', 'level', 'corrupted',
    'stackSize', 'calculated', 'total'];
  dataSource: any;

  constructor() { }

  ngOnInit() {
  }

  updateTable(newData: TableItem[]) {
    const data = [... newData];
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  isDivinationCard(icon: string) {
    return ItemHelper.isDivinationCard(icon);
  }

  getTabNames(tabs: CompactTab[]) {
    return TableHelper.getTabNames(tabs);
  }

}

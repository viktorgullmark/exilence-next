import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material';
import { SnapshotService } from '../../providers/snapshot.service';
import * as netWorthActions from './../../../../store/net-worth/net-worth.actions';
import * as netWorthReducer from './../../../../store/net-worth/net-worth.reducer';
import { Store } from '@ngrx/store';
import { NetWorthStatus } from '../../../../shared/interfaces/net-worth-status.interface';
import { Observable } from 'rxjs';
import { NetWorthState } from '../../../../app.states';
import * as moment from 'moment';

@Component({
  selector: 'app-net-worth-page',
  templateUrl: './net-worth-page.component.html',
  styleUrls: ['./net-worth-page.component.scss']
})
export class NetWorthPageComponent implements OnInit {
  public selectedIndex = 0;
  
  // todo: remove mock data
  public data = [
    [moment(new Date()).add(1, 'hours').toDate(), 1],
    [moment(new Date()).add(2, 'hours').toDate(), 2],
    [moment(new Date()).add(3, 'hours').toDate(), 2.5],
    [moment(new Date()).add(4, 'hours').toDate(), 2.7],
    [moment(new Date()).add(5, 'hours').toDate(), 3],
    [moment(new Date()).add(6, 'hours').toDate(), 7],
    [moment(new Date()).add(7, 'hours').toDate(), 10],
    [moment(new Date()).add(8, 'hours').toDate(), 2],
    [moment(new Date()).add(9, 'hours').toDate(), 3]
  ];

  @ViewChild('tabGroup', undefined) tabGroup: MatTabGroup;

  constructor(
    private snapshotService: SnapshotService,
    private netWorthStore: Store<NetWorthState>
  ) {
  }

  ngOnInit() {

    this.netWorthStore.dispatch(new netWorthActions.LoadTabs());

    this.tabGroup.selectedIndexChange.subscribe((res: number) => {
      window.dispatchEvent(new Event('resize'));
    });
  }

  tabsChanged(tabs: string[]) {
    this.netWorthStore.dispatch(new netWorthActions.UpdateTabSelection({
      tabs: tabs
    }));
  }
}

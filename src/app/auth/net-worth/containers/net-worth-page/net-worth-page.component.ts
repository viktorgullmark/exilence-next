import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material';
import { SnapshotService } from '../../providers/snapshot.service';
import * as netWorthActions from './../../../../store/net-worth/net-worth.actions';
import * as netWorthReducer from './../../../../store/net-worth/net-worth.reducer';
import { Store } from '@ngrx/store';
import { NetWorthStatus } from '../../../../shared/interfaces/net-worth-status.interface';
import { Observable } from 'rxjs';
import { NetWorthState } from '../../../../app.states';

@Component({
  selector: 'app-net-worth-page',
  templateUrl: './net-worth-page.component.html',
  styleUrls: ['./net-worth-page.component.scss']
})
export class NetWorthPageComponent implements OnInit {
  public selectedIndex = 0;

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

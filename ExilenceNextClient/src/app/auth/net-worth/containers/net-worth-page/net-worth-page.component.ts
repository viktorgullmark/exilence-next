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
import { Tab } from '../../../../shared/interfaces/stash.interface';
import { SnapshotHelper } from '../../../../shared/helpers/snapshot.helper';

@Component({
  selector: 'app-net-worth-page',
  templateUrl: './net-worth-page.component.html',
  styleUrls: ['./net-worth-page.component.scss']
})
export class NetWorthPageComponent implements OnInit {
  public selectedIndex = 0;
  public chartData = { data: [], columnNames: []};

  // todo: remove mock data
  public snapshots = [
    {
      timestamp: moment(new Date()).add(1, 'hours').toDate(),
      tabSnapshots: [
        {
          tabId: 'b70c2f714ceb1ccdbd44bbc548e55c1a9cc2908260cea417d5ae85e73220282b',
          value: 1
        },
        {
          tabId: 'ebdc4a40d48b3afb5706bf5becc03507ae35f8df411da385b4da17d250ae2309',
          value: 1
        },
        {
          tabId: 'bbfafd560da8db3ca15aacfd529f0b9a5b6df31367cd85dd901a48660035d1ea',
          value: 1
        },
        {
          tabId: 'fa3d230361fcf7b4e1ca0bd6d43d30e113f2d79943ec57436c2e93f9feaabfa7',
          value: 1
        },
        {
          tabId: '2ba40d8eebc43a1ca034282ea451b5422d236fe2b826cc0f63f749007b69ad40',
          value: 4
        },
      ]
    },
    {
      timestamp: moment(new Date()).add(2, 'hours').toDate(),
      tabSnapshots: [
        {
          tabId: 'b70c2f714ceb1ccdbd44bbc548e55c1a9cc2908260cea417d5ae85e73220282b',
          value: 2
        },
        {
          tabId: 'ebdc4a40d48b3afb5706bf5becc03507ae35f8df411da385b4da17d250ae2309',
          value: 2
        },
        {
          tabId: 'bbfafd560da8db3ca15aacfd529f0b9a5b6df31367cd85dd901a48660035d1ea',
          value: 3
        },
        {
          tabId: 'fa3d230361fcf7b4e1ca0bd6d43d30e113f2d79943ec57436c2e93f9feaabfa7',
          value: 4
        },
        {
          tabId: '2ba40d8eebc43a1ca034282ea451b5422d236fe2b826cc0f63f749007b69ad40',
          value: 4
        },
      ]
    },
    {
      timestamp: moment(new Date()).add(3, 'hours').toDate(),
      tabSnapshots: [
        {
          tabId: 'b70c2f714ceb1ccdbd44bbc548e55c1a9cc2908260cea417d5ae85e73220282b',
          value: 1
        },
        {
          tabId: 'ebdc4a40d48b3afb5706bf5becc03507ae35f8df411da385b4da17d250ae2309',
          value: 2
        },
        {
          tabId: 'bbfafd560da8db3ca15aacfd529f0b9a5b6df31367cd85dd901a48660035d1ea',
          value: 2
        },
        {
          tabId: 'fa3d230361fcf7b4e1ca0bd6d43d30e113f2d79943ec57436c2e93f9feaabfa7',
          value: 3
        },
        {
          tabId: '2ba40d8eebc43a1ca034282ea451b5422d236fe2b826cc0f63f749007b69ad40',
          value: 4
        },
      ]
    },
    {
      timestamp: moment(new Date()).add(4, 'hours').toDate(),
      tabSnapshots: [
        {
          tabId: 'b70c2f714ceb1ccdbd44bbc548e55c1a9cc2908260cea417d5ae85e73220282b',
          value: 4
        },
        {
          tabId: 'ebdc4a40d48b3afb5706bf5becc03507ae35f8df411da385b4da17d250ae2309',
          value: 5
        },
        {
          tabId: 'bbfafd560da8db3ca15aacfd529f0b9a5b6df31367cd85dd901a48660035d1ea',
          value: 4
        },
        {
          tabId: 'fa3d230361fcf7b4e1ca0bd6d43d30e113f2d79943ec57436c2e93f9feaabfa7',
          value: 3
        },
        {
          tabId: '2ba40d8eebc43a1ca034282ea451b5422d236fe2b826cc0f63f749007b69ad40',
          value: 4
        },
      ]
    },
    {
      timestamp: moment(new Date()).add(5, 'hours').toDate(),
      tabSnapshots: [
        {
          tabId: 'b70c2f714ceb1ccdbd44bbc548e55c1a9cc2908260cea417d5ae85e73220282b',
          value: 7
        },
        {
          tabId: 'ebdc4a40d48b3afb5706bf5becc03507ae35f8df411da385b4da17d250ae2309',
          value: 6
        },
        {
          tabId: 'bbfafd560da8db3ca15aacfd529f0b9a5b6df31367cd85dd901a48660035d1ea',
          value: 4
        },
        {
          tabId: 'fa3d230361fcf7b4e1ca0bd6d43d30e113f2d79943ec57436c2e93f9feaabfa7',
          value: 5
        },
        {
          tabId: '2ba40d8eebc43a1ca034282ea451b5422d236fe2b826cc0f63f749007b69ad40',
          value: 4
        },
      ]
    },
    {
      timestamp: moment(new Date()).add(6, 'hours').toDate(),
      tabSnapshots: [
        {
          tabId: 'b70c2f714ceb1ccdbd44bbc548e55c1a9cc2908260cea417d5ae85e73220282b',
          value: 8
        },
        {
          tabId: 'ebdc4a40d48b3afb5706bf5becc03507ae35f8df411da385b4da17d250ae2309',
          value: 7
        },
        {
          tabId: 'bbfafd560da8db3ca15aacfd529f0b9a5b6df31367cd85dd901a48660035d1ea',
          value: 5
        },
        {
          tabId: 'fa3d230361fcf7b4e1ca0bd6d43d30e113f2d79943ec57436c2e93f9feaabfa7',
          value: 6
        },
        {
          tabId: '2ba40d8eebc43a1ca034282ea451b5422d236fe2b826cc0f63f749007b69ad40',
          value: 4
        },
      ]
    },
    {
      timestamp: moment(new Date()).add(7, 'hours').toDate(),
      tabSnapshots: [
        {
          tabId: 'b70c2f714ceb1ccdbd44bbc548e55c1a9cc2908260cea417d5ae85e73220282b',
          value: 9
        },
        {
          tabId: 'ebdc4a40d48b3afb5706bf5becc03507ae35f8df411da385b4da17d250ae2309',
          value: 8
        },
        {
          tabId: 'bbfafd560da8db3ca15aacfd529f0b9a5b6df31367cd85dd901a48660035d1ea',
          value: 6
        },
        {
          tabId: 'fa3d230361fcf7b4e1ca0bd6d43d30e113f2d79943ec57436c2e93f9feaabfa7',
          value: 7
        },
        {
          tabId: '2ba40d8eebc43a1ca034282ea451b5422d236fe2b826cc0f63f749007b69ad40',
          value: 4
        },
      ]
    }
  ];

  @ViewChild('tabGroup', undefined) tabGroup: MatTabGroup;

  constructor(
    private netWorthStore: Store<NetWorthState>
  ) {
    this.netWorthStore.select(netWorthReducer.selectNetWorthTabs).subscribe((ids: string[]) => {
      this.chartData = SnapshotHelper.formatSnapshotsForChart(ids, this.snapshots);
      window.dispatchEvent(new Event('resize'));
    });
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

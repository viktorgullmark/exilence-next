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

@Component({
  selector: 'app-net-worth-page',
  templateUrl: './net-worth-page.component.html',
  styleUrls: ['./net-worth-page.component.scss']
})
export class NetWorthPageComponent implements OnInit {
  public selectedIndex = 0;

  public columnNames = ['Time'];

  // todo: remove mock data
  public data = [];
  public snapshots = [
    {
      timestamp: moment(new Date()).add(1, 'hours').toDate(),
      tabSnapshots: [
        {
          id: 'b70c2f714ceb1ccdbd44bbc548e55c1a9cc2908260cea417d5ae85e73220282b',
          value: 1
        },
        {
          id: 'ebdc4a40d48b3afb5706bf5becc03507ae35f8df411da385b4da17d250ae2309',
          value: 1
        },
        {
          id: 'bbfafd560da8db3ca15aacfd529f0b9a5b6df31367cd85dd901a48660035d1ea',
          value: 1
        },
        {
          id: 'fa3d230361fcf7b4e1ca0bd6d43d30e113f2d79943ec57436c2e93f9feaabfa7',
          value: 1
        },
        {
          id: '2ba40d8eebc43a1ca034282ea451b5422d236fe2b826cc0f63f749007b69ad40',
          value: 4
        },
      ]
    },
    {
      timestamp: moment(new Date()).add(2, 'hours').toDate(),
      tabSnapshots: [
        {
          id: 'b70c2f714ceb1ccdbd44bbc548e55c1a9cc2908260cea417d5ae85e73220282b',
          value: 2
        },
        {
          id: 'ebdc4a40d48b3afb5706bf5becc03507ae35f8df411da385b4da17d250ae2309',
          value: 2
        },
        {
          id: 'bbfafd560da8db3ca15aacfd529f0b9a5b6df31367cd85dd901a48660035d1ea',
          value: 3
        },
        {
          id: 'fa3d230361fcf7b4e1ca0bd6d43d30e113f2d79943ec57436c2e93f9feaabfa7',
          value: 4
        },
        {
          id: '2ba40d8eebc43a1ca034282ea451b5422d236fe2b826cc0f63f749007b69ad40',
          value: 4
        },
      ]
    },
    {
      timestamp: moment(new Date()).add(3, 'hours').toDate(),
      tabSnapshots: [
        {
          id: 'b70c2f714ceb1ccdbd44bbc548e55c1a9cc2908260cea417d5ae85e73220282b',
          value: 1
        },
        {
          id: 'ebdc4a40d48b3afb5706bf5becc03507ae35f8df411da385b4da17d250ae2309',
          value: 2
        },
        {
          id: 'bbfafd560da8db3ca15aacfd529f0b9a5b6df31367cd85dd901a48660035d1ea',
          value: 2
        },
        {
          id: 'fa3d230361fcf7b4e1ca0bd6d43d30e113f2d79943ec57436c2e93f9feaabfa7',
          value: 3
        },
        {
          id: '2ba40d8eebc43a1ca034282ea451b5422d236fe2b826cc0f63f749007b69ad40',
          value: 4
        },
      ]
    },
    {
      timestamp: moment(new Date()).add(4, 'hours').toDate(),
      tabSnapshots: [
        {
          id: 'b70c2f714ceb1ccdbd44bbc548e55c1a9cc2908260cea417d5ae85e73220282b',
          value: 4
        },
        {
          id: 'ebdc4a40d48b3afb5706bf5becc03507ae35f8df411da385b4da17d250ae2309',
          value: 5
        },
        {
          id: 'bbfafd560da8db3ca15aacfd529f0b9a5b6df31367cd85dd901a48660035d1ea',
          value: 4
        },
        {
          id: 'fa3d230361fcf7b4e1ca0bd6d43d30e113f2d79943ec57436c2e93f9feaabfa7',
          value: 3
        },
        {
          id: '2ba40d8eebc43a1ca034282ea451b5422d236fe2b826cc0f63f749007b69ad40',
          value: 4
        },
      ]
    },
    {
      timestamp: moment(new Date()).add(5, 'hours').toDate(),
      tabSnapshots: [
        {
          id: 'b70c2f714ceb1ccdbd44bbc548e55c1a9cc2908260cea417d5ae85e73220282b',
          value: 7
        },
        {
          id: 'ebdc4a40d48b3afb5706bf5becc03507ae35f8df411da385b4da17d250ae2309',
          value: 6
        },
        {
          id: 'bbfafd560da8db3ca15aacfd529f0b9a5b6df31367cd85dd901a48660035d1ea',
          value: 4
        },
        {
          id: 'fa3d230361fcf7b4e1ca0bd6d43d30e113f2d79943ec57436c2e93f9feaabfa7',
          value: 5
        },
        {
          id: '2ba40d8eebc43a1ca034282ea451b5422d236fe2b826cc0f63f749007b69ad40',
          value: 4
        },
      ]
    },
    {
      timestamp: moment(new Date()).add(6, 'hours').toDate(),
      tabSnapshots: [
        {
          id: 'b70c2f714ceb1ccdbd44bbc548e55c1a9cc2908260cea417d5ae85e73220282b',
          value: 8
        },
        {
          id: 'ebdc4a40d48b3afb5706bf5becc03507ae35f8df411da385b4da17d250ae2309',
          value: 7
        },
        {
          id: 'bbfafd560da8db3ca15aacfd529f0b9a5b6df31367cd85dd901a48660035d1ea',
          value: 5
        },
        {
          id: 'fa3d230361fcf7b4e1ca0bd6d43d30e113f2d79943ec57436c2e93f9feaabfa7',
          value: 6
        },
        {
          id: '2ba40d8eebc43a1ca034282ea451b5422d236fe2b826cc0f63f749007b69ad40',
          value: 4
        },
      ]
    },
    {
      timestamp: moment(new Date()).add(7, 'hours').toDate(),
      tabSnapshots: [
        {
          id: 'b70c2f714ceb1ccdbd44bbc548e55c1a9cc2908260cea417d5ae85e73220282b',
          value: 9
        },
        {
          id: 'ebdc4a40d48b3afb5706bf5becc03507ae35f8df411da385b4da17d250ae2309',
          value: 8
        },
        {
          id: 'bbfafd560da8db3ca15aacfd529f0b9a5b6df31367cd85dd901a48660035d1ea',
          value: 6
        },
        {
          id: 'fa3d230361fcf7b4e1ca0bd6d43d30e113f2d79943ec57436c2e93f9feaabfa7',
          value: 7
        },
        {
          id: '2ba40d8eebc43a1ca034282ea451b5422d236fe2b826cc0f63f749007b69ad40',
          value: 4
        },
      ]
    }
  ];

  @ViewChild('tabGroup', undefined) tabGroup: MatTabGroup;

  constructor(
    private snapshotService: SnapshotService,
    private netWorthStore: Store<NetWorthState>
  ) {
    this.netWorthStore.select(netWorthReducer.selectNetWorthTabs).subscribe((ids: string[]) => {
      this.data = [];
      this.columnNames = ['Time'];
      if (ids.length > 0) {
        for (let i = 0; i < ids.length; i++) {
          this.columnNames.push(ids[i]);

          for (let j = 0; j < this.snapshots.length; j++) {
            const tabValue = this.snapshots[j].tabSnapshots.find(ts => ts.id === ids[i]).value; 
            // if first snapshot, start by creating new arr to store data in
            if (i === 0) {
              this.data.push([
                this.snapshots[j].timestamp
              ]);
            }
            this.data[j].push(tabValue)
          }
        }
      }
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

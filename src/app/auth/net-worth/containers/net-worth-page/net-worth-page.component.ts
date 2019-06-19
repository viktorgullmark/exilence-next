import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material';
import { SnapshotService } from '../../providers/snapshot.service';
import * as applicationActions from './../../../../store/application/application.actions';
import * as appReducer from './../../../../store/application/application.reducer';
import { Store } from '@ngrx/store';
import { Application } from '../../../../shared/interfaces/application.interface';
import { Observable } from 'rxjs';

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
    private store: Store<Application>
  ) {
  }

  ngOnInit() {

    this.store.dispatch(new applicationActions.LoadTabs());

    this.tabGroup.selectedIndexChange.subscribe((res: number) => {
      window.dispatchEvent(new Event('resize'));
    });
  }

  tabsChanged(tabs: string[]) {
    this.store.dispatch(new applicationActions.UpdateTabSelection({
      tabs: tabs
    }));
  }
}

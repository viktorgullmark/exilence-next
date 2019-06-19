import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material';
import { SnapshotService } from '../../providers/snapshot.service';

@Component({
  selector: 'app-net-worth-page',
  templateUrl: './net-worth-page.component.html',
  styleUrls: ['./net-worth-page.component.scss']
})
export class NetWorthPageComponent implements OnInit {
  public selectedIndex = 0;

  @ViewChild('tabGroup', undefined) tabGroup: MatTabGroup;

  constructor(private snapshotService: SnapshotService) { }

  ngOnInit() {
    this.tabGroup.selectedIndexChange.subscribe((res: number) => {
      window.dispatchEvent(new Event('resize'));
    });
  }

  tabsChanged(tabs: string[]) {
    console.log(tabs);

    // todo: dispatch new selection to store
  }
}

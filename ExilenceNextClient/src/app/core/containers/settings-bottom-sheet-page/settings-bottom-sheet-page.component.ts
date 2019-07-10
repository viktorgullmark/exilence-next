import 'rxjs/add/operator/takeUntil';

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatBottomSheet, MatSidenav } from '@angular/material';
import { Subject } from 'rxjs';

import {
  SettingsBottomSheetContentComponent,
} from '../../components/settings-bottom-sheet-content/settings-bottom-sheet-content.component';

@Component({
  selector: 'app-settings-bottom-sheet-page',
  templateUrl: 'settings-bottom-sheet-page.component.html',
  styleUrls: ['settings-bottom-sheet-page.component.scss'],
})
export class SettingsBottomSheetPageComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  public toggled = false;

  constructor(private _bottomSheet: MatBottomSheet) {
  }

  ngOnInit() {
  }

  openBottomSheet(): void {
    this._bottomSheet.open(SettingsBottomSheetContentComponent);
  }

  toggle() {
    this.openBottomSheet();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}

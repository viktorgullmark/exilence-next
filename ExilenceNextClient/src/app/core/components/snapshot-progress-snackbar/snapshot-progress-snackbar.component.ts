import { Component, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';

import { NetWorthState } from '../../../app.states';
import { selectNetWorthFetchedTabsCount, selectNetWorthTabsCount } from '../../../store/net-worth/net-worth.selectors';
import { SnapshotProgressSnackbarSnackComponent } from './snapshot-progress-snackbar-snack/snapshot-progress-snackbar-snack.component';

@Component({
  selector: 'app-snapshot-progress-snackbar',
  templateUrl: './snapshot-progress-snackbar.component.html',
  styleUrls: ['./snapshot-progress-snackbar.component.scss']
})

export class SnapshotProgressSnackbarComponent implements OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  public isOpen = false;
  public tabCount$: Observable<number>;
  public tabCountFetched$: Observable<number>;

  constructor(private _snackBar: MatSnackBar, private netWorthStore: Store<NetWorthState>) {
    this.netWorthStore.select(selectNetWorthTabsCount).takeUntil(this.destroy$).subscribe(tabsCount => {
      this.netWorthStore.select(selectNetWorthFetchedTabsCount).takeUntil(this.destroy$).subscribe(fetchedTabsCount => {
        if (tabsCount > 0) {
          if (fetchedTabsCount < tabsCount) {
            if (!this.isOpen) {
              this.isOpen = true;
              this._snackBar.openFromComponent(SnapshotProgressSnackbarSnackComponent, {
                horizontalPosition: 'left'
              });
            }
          } else {
            this._snackBar.dismiss();
            this.isOpen = false;
          }
        }
      });
    });

  }

  openSnackBar() {

  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}

import { Component, OnDestroy, Input } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { Store } from '@ngrx/store';
import { NetWorthState } from '../../../../app.states';
import { selectNetWorthTabsCount, selectNetWorthFetchedTabsCount } from '../../../../store/net-worth/net-worth.selectors';

@Component({
    selector: 'app-snapshot-progress-snackbar-snack',
    templateUrl: './snapshot-progress-snackbar-snack.component.html',
    styleUrls: ['./snapshot-progress-snackbar-snack.component.scss']
})
export class SnapshotProgressSnackbarSnackComponent implements OnDestroy {
    destroy$: Subject<boolean> = new Subject<boolean>();

    @Input() titleTranslation = 'SNAPSHOT.IN_PROGRESS';
    @Input() progressTranslation = 'SNAPSHOT.FETCHING_TAB';

    public tabCountFetched$: Observable<number>;
    public tabCount: number;

    constructor(private netWorthStore: Store<NetWorthState>) {
        this.netWorthStore.select(selectNetWorthTabsCount).takeUntil(this.destroy$).subscribe(res => {
            this.tabCount = res;
        });
        this.tabCountFetched$ = this.netWorthStore.select(selectNetWorthFetchedTabsCount).takeUntil(this.destroy$);
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    animationEnded(event: any) {
        console.log(event);
    }
}

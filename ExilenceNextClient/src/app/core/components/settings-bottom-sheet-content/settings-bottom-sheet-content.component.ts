import { Component, OnDestroy } from '@angular/core';
import { MatBottomSheetRef, MatSlideToggleChange } from '@angular/material';
import { NetWorthState } from '../../../app.states';
import { Store } from '@ngrx/store';
import * as netWorthActions from './../../../store/net-worth/net-worth.actions';
import { Observable, Subject } from 'rxjs';
import { selectNetWorthSettings } from '../../../store/net-worth/net-worth.selectors';
import { NetWorthSettings } from '../../../shared/interfaces/net-worth-settings.interface';
import { StorageService } from '../../providers/storage.service';

@Component({
    selector: 'app-settings-bottom-sheet-content',
    templateUrl: 'settings-bottom-sheet-content.component.html',
    styleUrls: ['settings-bottom-sheet-content.component.scss']
})
export class SettingsBottomSheetContentComponent implements OnDestroy {
    destroy$: Subject<boolean> = new Subject<boolean>();

    public netWorthSettings: NetWorthSettings;
    public selectedIndex = 0;
    constructor(
        private netWorthStore: Store<NetWorthState>,
        public storageService: StorageService,
        private _bottomSheetRef: MatBottomSheetRef<SettingsBottomSheetContentComponent>) {

        this.netWorthStore.select(selectNetWorthSettings).subscribe((settings: NetWorthSettings) => {
            this.netWorthSettings = settings;
        });
    }
    openLink(event: MouseEvent): void {
        this._bottomSheetRef.dismiss();
        event.preventDefault();
    }

    toggleAutomaticSnapshotting(event: MatSlideToggleChange) {
        this.netWorthSettings.automaticSnapshotting = event.checked;
        this.updateSettings(this.netWorthSettings);
    }

    updateSettings(settings: NetWorthSettings) {
        this.netWorthStore.dispatch(new netWorthActions.UpdateSettings({ settings: settings }));
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}

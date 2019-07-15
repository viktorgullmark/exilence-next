import { Component } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material';

@Component({
    selector: 'app-settings-bottom-sheet-content',
    templateUrl: 'settings-bottom-sheet-content.component.html',
    styleUrls: ['settings-bottom-sheet-content.component.scss']
})
export class SettingsBottomSheetContentComponent {
    public selectedIndex = 0;
    constructor(private _bottomSheetRef: MatBottomSheetRef<SettingsBottomSheetContentComponent>) { }
    openLink(event: MouseEvent): void {
        this._bottomSheetRef.dismiss();
        event.preventDefault();
    }
}

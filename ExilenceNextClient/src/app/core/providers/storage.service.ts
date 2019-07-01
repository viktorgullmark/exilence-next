import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { StorageMap } from '@ngx-pwa/local-storage';
import { skip } from 'rxjs/operators';

import { AppState } from '../../app.states';

@Injectable()
export class StorageService {

    constructor(
        private appStore: Store<AppState>,
        private storageMap: StorageMap
    ) {
        this.appStore.pipe(skip(1)).subscribe((state: AppState) => {
            this.storageMap.set('appState', state.applicationState).subscribe();
        });
    }
}

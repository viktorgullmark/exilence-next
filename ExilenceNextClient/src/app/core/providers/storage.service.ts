import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { StorageMap } from '@ngx-pwa/local-storage';

import { ApplicationSession } from '../../shared/interfaces/application-session.interface';
import { AppState } from '../../app.states';
import { skip } from 'rxjs/operators';
import { initialState } from '../../store/application/application.reducer';

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

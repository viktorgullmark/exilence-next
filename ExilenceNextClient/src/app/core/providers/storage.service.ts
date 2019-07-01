import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { StorageMap } from '@ngx-pwa/local-storage';

import { ApplicationSession } from '../../shared/interfaces/application-session.interface';
import * as applicationReducer from './../../store/application/application.reducer';
import * as applicationActions from './../../store/application/application.actions';
import { forkJoin, of, pipe } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable()
export class StorageService {

    constructor(
        private appStore: Store<ApplicationSession>,
        private storageMap: StorageMap
    ) {
        this.loadSession();
    }

    loadSession() {
        const requests$ = forkJoin(
            this.storageMap.get('session.accountDetails'),
            this.storageMap.get('session.leagues'),
            this.storageMap.get('session.characters'),
            this.storageMap.get('session.characterLeagues')
        );

        requests$.subscribe((res: any[]) => {
            if (res[0] !== undefined && res[1] !== undefined && res[2] !== undefined) {
                const session = {
                    sessionId: res[0].sessionId,
                    account: res[0].account,
                    leagues: res[1],
                    characters: res[2]
                } as ApplicationSession;
                this.appStore.dispatch(new applicationActions.SetSession({ session: session }));
            }
        });
    }
}

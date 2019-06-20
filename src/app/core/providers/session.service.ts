import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { ApplicationSession } from '../../shared/interfaces/application-session.interface';
import * as applicationActions from './../../store/application/application.actions';
import { CookieService } from './cookie.service';
import { StorageService } from './storage.service';

@Injectable()
export class SessionService {

    constructor(private storageService: StorageService,
        private cookieService: CookieService,
        private appStore: Store<ApplicationSession>
    ) {
    }

    setSessionCookie(sessionId: string) {
        this.cookieService.setSessionCookie(sessionId);
    }

    createSession(data: ApplicationSession) {
        this.setSessionCookie(data.sessionId);

        this.appStore.dispatch(new applicationActions.InitSession({
            session: data
        }));
    }
}

import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { Session } from '../../shared/interfaces/session.interface';
import * as applicationActions from './../../store/application/application.actions';
import { CookieService } from './cookie.service';
import { SettingsService } from './settings.service';

@Injectable()
export class SessionService {

    constructor(private settingsService: SettingsService,
        private cookieService: CookieService,
        private appStore: Store<Session>
    ) {
    }

    setSessionCookie(sessionId: string) {
        this.cookieService.setSessionCookie(sessionId);
    }

    createSession(data: Session) {
        this.setSessionCookie(data.sessionId);

        this.appStore.dispatch(new applicationActions.InitSession({
            session: data
        }));

        this.settingsService.setKey('session', data);
    }

    getSession() {
        return this.settingsService.get('session');
    }
}

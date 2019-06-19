import { Injectable } from '@angular/core';
import { Session } from '../../shared/interfaces/session.interface';
import { SettingsService } from './settings.service';
import { CookieService } from './cookie.service';
import { Store } from '@ngrx/store';
import { Application } from '../../shared/interfaces/application.interface';
import { Observable } from 'rxjs';
import * as applicationActions from './../../store/application/application.actions';
import * as appReducer from './../../store/application/application.reducer';

@Injectable()
export class SessionService {

    private appSession$: Observable<Session>;

    constructor(private settingsService: SettingsService,
        private cookieService: CookieService,
        private appStore: Store<Application>
    ) {
        this.appSession$ = this.appStore.select(appReducer.selectApplicationSession);
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

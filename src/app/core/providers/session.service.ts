import { Injectable } from '@angular/core';
import { SessionForm } from '../../shared/interfaces/session-form.interface';
import { SettingsService } from './settings.service';
import { CookieService } from './cookie.service';

@Injectable()
export class SessionService {

    constructor(private settingsService: SettingsService, private cookieService: CookieService) { }

    setSessionCookie(sessionId: string) {
        this.cookieService.setSessionCookie(sessionId);
    }

    createSession(data: SessionForm) {
        this.setSessionCookie(data.sessionId);
        this.settingsService.setKey('session', data);
    }

    getSession() {
        return this.settingsService.get('session');
    }
}

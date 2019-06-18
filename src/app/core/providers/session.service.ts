import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { SessionForm } from '../../shared/interfaces/session-form.interface';
import { SettingsService } from './settings.service';

@Injectable()
export class SessionService {

    constructor(private cookieService: CookieService, private settingsService: SettingsService) { }

    getSessionCookie() {
        return this.cookieService.get('POESESSID');
    }

    setSessionCookie(sessionId: string) {
        this.cookieService.set('POESESSID', sessionId, undefined, '/', '.pathofexile.com');
    }

    createSession(data: SessionForm) {
        this.setSessionCookie(data.sessionId);
        this.settingsService.setKey('session', data);
    }
}

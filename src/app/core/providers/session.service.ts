import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class SessionService {

    constructor(private cookieService: CookieService) { }

    getSessionCookie() {
        this.cookieService.get('POESESSID');
    }

    setSessionCookie(sessionId: string) {
        this.cookieService.set('POESESSID', sessionId, undefined, '/', '.pathofexile.com', false);
    }
}

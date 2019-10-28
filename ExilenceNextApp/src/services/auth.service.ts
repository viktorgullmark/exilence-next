import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { ICookie } from './../interfaces/cookie.interface';
import { electronService } from './electron.service';

export const authService = {
    setAuthCookie,
    isLoggedIn
};

function setAuthCookie(cookie: ICookie): Observable<any> {
    return removeAuthCookie().pipe(switchMap(() => {
        return from(electronService.remote.session.defaultSession.cookies.set(cookie));
    }));
}

function removeAuthCookie(): Observable<any> {
    return from(electronService.remote.session.defaultSession.cookies.remove('https://www.pathofexile.com', 'POESESSID'));
}

function isLoggedIn() {
    // todo: implement and check directly against state instead
    return false;
}


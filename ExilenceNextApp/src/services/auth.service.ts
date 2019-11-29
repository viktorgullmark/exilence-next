import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import axios from 'axios-observable';
import { ICookie } from './../interfaces/cookie.interface';
import { electronService } from './electron.service';
import { AxiosResponse } from 'axios';
import { Account } from '../store/domains/account';
import AppConfig from './../config/app.config';

export const authService = {
    getToken,
    setAuthCookie,
    isLoggedIn
};

function getToken(account: Account): Observable<AxiosResponse<string>> {
    return axios.post<string>(`${AppConfig.baseUrl}/api/authentication`, account)
}

function setAuthCookie(cookie: ICookie): Observable<any> {
    return removeAuthCookie().pipe(switchMap(() => {
        return from(electronService.remote.session.defaultSession!.cookies.set(cookie));
    }));
}

function removeAuthCookie(): Observable<any> {
    return from(electronService.remote.session.defaultSession!.cookies.remove('https://www.pathofexile.com', 'POESESSID'));
}

function isLoggedIn() {
    // todo: implement and check directly against state instead
    return false;
}


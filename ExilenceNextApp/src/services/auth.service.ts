import { AxiosResponse } from 'axios';
import axios from 'axios-observable';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { IAccountAuth } from '../interfaces/account-auth.interface';
import AppConfig from './../config/app.config';
import { ICookie } from './../interfaces/cookie.interface';
import { electronService } from './electron.service';

export const authService = {
    getToken,
    setAuthCookie,
    isLoggedIn
};

function getToken(account: IAccountAuth): Observable<AxiosResponse<string>> {
    return axios.post<string>(`${AppConfig.baseUrl}/api/authentication/token`, account)
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


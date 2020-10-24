import { AxiosResponse } from 'axios';
import axios from 'axios-observable';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { IAccountAuth } from '../interfaces/account-auth.interface';
import { IApiAccount } from '../interfaces/api/api-account.interface';
import AppConfig from './../config/app.config';
import { ICookie } from './../interfaces/cookie.interface';
import { electronService } from './electron.service';

export const authService = {
  getToken,
  setAuthCookie,
  getAuthCookie,
  removeAuthCookie,
  isLoggedIn,
};

function getToken(account: IAccountAuth): Observable<AxiosResponse<IApiAccount>> {
  return axios.post<IApiAccount>(`${AppConfig.baseUrl}/api/authentication/token`, account);
}

function setAuthCookie(cookie: ICookie): Observable<any> {
  return removeAuthCookie().pipe(
    switchMap(() => from(electronService.ipcRenderer.invoke('set-cookie', cookie)))
  );
}

function getAuthCookie(): Observable<any> {
  return from(electronService.ipcRenderer.invoke('get-cookie', { name: 'POESESSID' }));
}

function removeAuthCookie(): Observable<any> {
  return from(
    electronService.ipcRenderer.invoke('remove-cookie', AppConfig.pathOfExileUrl, 'POESESSID')
  );
}

function isLoggedIn() {
  // todo: implement and check directly against state instead
  return false;
}

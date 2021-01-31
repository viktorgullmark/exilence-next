import { ICookie } from '../interfaces/cookie.interface';
import AppConfig from './../config/app.config';

export function constructCookie(sessionId: string): ICookie {
  const cookie: ICookie = {
    url: AppConfig.pathOfExileUrl,
    name: 'POESESSID',
    value: sessionId,
    domain: AppConfig.pathOfExileCookieDomain,
    path: '/',
    secure: true,
    expirationDate: 2550873600,
    sameSite: 'no_restriction',
  };
  return cookie;
}

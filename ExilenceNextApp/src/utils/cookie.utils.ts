import { ICookie } from '../interfaces/cookie.interface';

export class CookieUtils {
  public static constructCookie(sessionId: string): ICookie {
    const cookie: ICookie = {
      url: 'https://www.pathofexile.com',
      name: 'POESESSID',
      value: sessionId,
      domain: '.pathofexile.com',
      path: '/',
      secure: true,
      expirationDate: 2550873600
    };
    return cookie;
  }
}

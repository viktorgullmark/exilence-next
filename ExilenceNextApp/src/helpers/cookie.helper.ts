import { ICookie } from './../interfaces/cookie.interface';

export class CookieHelper {
  public static constructCookie(sessionId: string): ICookie {
    const cookie: ICookie = {
      url: 'https://www.pathofexile.com',
      name: 'POESESSID',
      value: sessionId,
      domain: '.pathofexile.com',
      path: '/',
      secure: true,
      expirationDate: undefined
    };
    return cookie;
  }
}

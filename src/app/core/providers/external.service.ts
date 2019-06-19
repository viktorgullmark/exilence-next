import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import RateLimiter from 'rxjs-ratelimiter';
import { Stash } from '../../shared/interfaces/stash.interface';
import { Observable } from 'rxjs';

@Injectable()
export class ExternalService {

  private rateLimiter = new RateLimiter(7, 10000);

  constructor(private http: HttpClient) { }

  /* #region pathofexile.com */
  getStashTab(account: string, league: string, index: number): Observable<Stash> {
    const parameters = `?league=${league}&accountName=${account}&tabIndex=${index}&tabs=1`;
    return this.rateLimiter.limit(
      this.http.get<Stash>('https://www.pathofexile.com/character-window/get-stash-items' + parameters)
    );
  }

  getStashTabs(account: string, league: string) {
    const parameters = `?league=${league}&accountName=${account}&tabs=1`;
    return this.rateLimiter.limit(
      this.http.get<Stash>('https://www.pathofexile.com/character-window/get-stash-items' + parameters)
    );
  }
  /* #endregion */

}

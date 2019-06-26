import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import RateLimiter from 'rxjs-ratelimiter';

import { RatelimitHelper } from '../../shared/helpers/ratelimit.helper';
import { ApplicationSessionDetails } from '../../shared/interfaces/application-session-details.interface';
import { Stash } from '../../shared/interfaces/stash.interface';

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

  getLeagues(type: string = 'main', compact: number = 1) {
    const parameters = `?type=${type}&compact=${compact}`;

    // todo: fetch leagues

    return of(['league1', 'league2']);
  }

  getCharacters(account: string) {
    const parameters = `?accountName=${account}`;

    // todo: fetch chars

    return of(['char1']);
  }

  /* #endregion */

  updateRatelimit(requestCount: number, milliseconds: number) {
    this.rateLimiter = RatelimitHelper.updateRatelimit(requestCount, milliseconds);
  }

}

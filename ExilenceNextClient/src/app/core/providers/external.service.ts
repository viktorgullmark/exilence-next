import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import RateLimiter from 'rxjs-ratelimiter';

import { RatelimitHelper } from '../../shared/helpers/ratelimit.helper';
import { ApplicationSessionDetails } from '../../shared/interfaces/application-session-details.interface';
import { Stash } from '../../shared/interfaces/stash.interface';
import { Character } from '../../shared/interfaces/character.interface';
import { League } from '../../shared/interfaces/league.interface';

@Injectable()
export class ExternalService {

  private rateLimiter = new RateLimiter(7, 10000);
  private poeUrl = 'https://www.pathofexile.com';

  constructor(private http: HttpClient) { }

  /* #region pathofexile.com */
  getStashTab(account: string, league: string, index: number): Observable<Stash> {
    const parameters = `?league=${league}&accountName=${account}&tabIndex=${index}&tabs=1`;
    return this.rateLimiter.limit(
      this.http.get<Stash>(this.poeUrl + '/character-window/get-stash-items' + parameters)
    );
  }

  getStashTabs(account: string, league: string) {
    const parameters = `?league=${league}&accountName=${account}&tabs=1`;
    return this.rateLimiter.limit(
      this.http.get<Stash>(this.poeUrl + '/character-window/get-stash-items' + parameters)
    );
  }

  getLeagues(type: string = 'main', compact: number = 1): Observable<League[]> {
    const parameters = `?type=${type}&compact=${compact}`;
    return this.rateLimiter.limit(
      this.http.get<League[]>('https://api.pathofexile.com/leagues' + parameters));
  }

  getCharacters(account: string): Observable<Character[]> {
    const parameters = `?accountName=${account}`;
    return this.rateLimiter.limit(
      this.http.get<Character[]>(this.poeUrl + '/character-window/get-characters' + parameters));
  }

  /* #endregion */

  updateRatelimit(requestCount: number, milliseconds: number) {
    this.rateLimiter = RatelimitHelper.updateRatelimit(requestCount, milliseconds);
  }

}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from, forkJoin, combineLatest } from 'rxjs';
import RateLimiter from 'rxjs-ratelimiter';

import { RatelimitHelper } from '../../shared/helpers/ratelimit.helper';
import { Character } from '../../shared/interfaces/character.interface';
import { League } from '../../shared/interfaces/league.interface';
import { Stash, Tab } from '../../shared/interfaces/stash.interface';
import { ApplicationSession } from '../../shared/interfaces/application-session.interface';
import { Store } from '@ngrx/store';
import { selectApplicationSession } from '../../store/application/application.selectors';
import { PricedItem } from '../../shared/interfaces/priced-item.interface';
import { map } from 'rxjs/operators';
import { Item } from '../../shared/interfaces/item.interface';

@Injectable()
export class ExternalService {

  private rateLimiter = new RateLimiter(7, 15000);
  private poeUrl = 'https://www.pathofexile.com';

  private session$: Observable<ApplicationSession>;
  private session: ApplicationSession;

  constructor(
    private http: HttpClient,
    private appStore: Store<ApplicationSession>
  ) {
    this.session$ = this.appStore.select(selectApplicationSession);
    this.session$.subscribe((session: ApplicationSession) => {
      this.session = session;
    });
  }

  /* #region pathofexile.com */
  getStashTab(account: string = this.session.account, league: string = this.session.tradeLeague, index: number): Observable<Stash> {
    const parameters = `?league=${league}&accountName=${account}&tabIndex=${index}&tabs=1`;
    return this.rateLimiter.limit(
      this.http.get<Stash>(this.poeUrl + '/character-window/get-stash-items' + parameters)
    );
  }

  getStashTabs(account: string = this.session.account, league: string = this.session.tradeLeague) {
    const parameters = `?league=${league}&accountName=${account}&tabs=1`;
    return this.rateLimiter.limit(
      this.http.get<Stash>(this.poeUrl + '/character-window/get-stash-items' + parameters)
    );
  }

  getItemsForTabs(tabs: Tab[], account: string = this.session.account, league: string = this.session.tradeLeague) {
    return forkJoin((tabs.slice(0, 20).map((tab: Tab) => {
      return this.getStashTab(account, league, tab.i).pipe(map((stash: Stash) => {
        tab.items = stash.items.map((item: Item) => {
          return { name: item.typeLine, id: item.id } as PricedItem;
        });
        return tab;
      }));
    })));
  }

  getLeagues(type: string = 'main', compact: number = 1): Observable<League[]> {
    const parameters = `?type=${type}&compact=${compact}`;
    return this.rateLimiter.limit(
      this.http.get<League[]>('https://api.pathofexile.com/leagues' + parameters));
  }

  getCharacters(account: string = this.session.account): Observable<Character[]> {
    const parameters = `?accountName=${account}`;
    return this.rateLimiter.limit(
      this.http.get<Character[]>(this.poeUrl + '/character-window/get-characters' + parameters));
  }

  /* #endregion */

  updateRatelimit(requestCount: number, milliseconds: number) {
    this.rateLimiter = RatelimitHelper.updateRatelimit(requestCount, milliseconds);
  }

}

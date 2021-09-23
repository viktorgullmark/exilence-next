import { AxiosResponse } from 'axios';
import axios from 'axios-observable';
import { forkJoin, Observable, throwError } from 'rxjs';
import RateLimiter from 'rxjs-ratelimiter';
import { map } from 'rxjs/operators';

import { rootStore } from '..';
import { ICharacter } from '../interfaces/character.interface';
import { IGithubRelease } from '../interfaces/github/github-release.interface';
import { ILeague } from '../interfaces/league.interface';
import { IPoeProfile } from '../interfaces/poe-profile.interface';
import { IStash, IStashTab, IStashTabResponse } from '../interfaces/stash.interface';
import { mapItemsToPricedItems } from '../utils/item.utils';
import AppConfig from './../config/app.config';
import { IStashTabSnapshot } from './../interfaces/stash-tab-snapshot.interface';

const rateLimiter = new RateLimiter(5, 10000);
const apiUrl = AppConfig.pathOfExileApiUrl;

export const externalService = {
  getLatestRelease,
  getStashTab,
  getStashTabs,
  getItemsForTabs,
  getLeagues,
  getCharacters,
  getCharacter,
  getProfile,
  loginWithOAuth,
};

/* #region github.com */
function getLatestRelease() {
  return axios.get<IGithubRelease>(
    'https://api.github.com/repos/viktorgullmark/exilence-next/releases/latest'
  );
}

function loginWithOAuth(code: string): Observable<AxiosResponse<any>> {
  return axios.get(`${AppConfig.baseUrl}/api/authentication/oauth2?code=${code}`);
}
/* #endregion */

/* #region pathofexile.com */
function getStashTab(league: string, id: string): Observable<AxiosResponse<IStashTabResponse>> {
  return rateLimiter.limit(axios.get<IStashTabResponse>(`${apiUrl}/stash/${league}/${id}`));
}

function getStashTabs(league: string): Observable<AxiosResponse<IStash>> {
  return rateLimiter.limit(axios.get<IStash>(`${apiUrl}/stash/${league}`));
}

function getItemsForTabs(tabs: IStashTab[], league: string) {
  if (tabs.length === 0) {
    return throwError(new Error('no_stash_tabs_selected_for_profile'));
  }

  return forkJoin(
    tabs.map((tab: IStashTab) => {
      return getStashTab(league, tab.id).pipe(
        map((stashTab: AxiosResponse<IStashTabResponse>) => {
          rootStore.uiStateStore.incrementStatusMessageCount();
          const items = {
            pricedItems: stashTab.data.stash.items
              ? mapItemsToPricedItems(stashTab.data.stash.items, tab)
              : [],
          };
          return { ...{ stashTabId: tab.id }, ...items } as IStashTabSnapshot;
        })
      );
    })
  );
}

function getLeagues(
  type: string = 'main',
  compact: number = 1,
  realm: string = 'pc'
): Observable<AxiosResponse<ILeague[]>> {
  const parameters = `?type=${type}&compact=${compact}${getRealmParam(realm)}`;
  return rateLimiter.limit(
    axios.get<ILeague[]>(apiUrl + '/leagues' + parameters, { headers: null })
  );
}

function getCharacters(): Observable<AxiosResponse<ICharacter[]>> {
  return rateLimiter.limit(axios.get<ICharacter[]>(`${apiUrl}/character`));
}

function getCharacter(character: string): Observable<AxiosResponse<ICharacter>> {
  return rateLimiter.limit(axios.get<ICharacter>(`${apiUrl}/character/${character}`));
}

function getProfile(realm: string = 'pc'): Observable<AxiosResponse<IPoeProfile>> {
  const parameters = `?realm=${realm}`;

  return rateLimiter.limit(axios.get<IPoeProfile>(apiUrl + '/profile' + parameters));
}

function getRealmParam(realm?: string) {
  return realm !== undefined ? `&realm=${realm}` : '';
}

/* #endregion */

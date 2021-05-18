import { AxiosResponse } from 'axios';
import axios from 'axios-observable';
import { forkJoin, Observable, throwError } from 'rxjs';
import RateLimiter from 'rxjs-ratelimiter';
import { map } from 'rxjs/operators';

import { rootStore } from '..';
import { ICharacterWithItems } from '../interfaces/character-with-items.interface';
import { ICharacter } from '../interfaces/character.interface';
import { IGithubRelease } from '../interfaces/github/github-release.interface';
import { ILeague } from '../interfaces/league.interface';
import { IPoeProfile } from '../interfaces/poe-profile.interface';
import { IStash, IStashTab } from '../interfaces/stash.interface';
import { mapItemsToPricedItems } from '../utils/item.utils';
import AppConfig from './../config/app.config';
import { IStashTabSnapshot } from './../interfaces/stash-tab-snapshot.interface';

const rateLimiter = new RateLimiter(5, 10000);
const poeUrl = AppConfig.pathOfExileUrl;
const apiUrl = AppConfig.pathOfExileApiUrl;

export const externalService = {
  getLatestRelease,
  getStashTab,
  getStashTabs,
  getItemsForTabs,
  getLeagues,
  getCharacters,
  getCharacterItems,
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
function getStashTab(
  account: string,
  league: string,
  index: number,
  realm?: string
): Observable<AxiosResponse<IStash>> {
  const parameters = `?league=${league}&accountName=${account}&tabIndex=${index}&tabs=1${getRealmParam(
    realm
  )}`;
  return rateLimiter.limit(
    axios.get<IStash>(poeUrl + '/character-window/get-stash-items' + parameters)
  );
}

function getStashTabs(
  account: string,
  league: string,
  realm?: string
): Observable<AxiosResponse<IStash>> {
  const parameters = `?league=${league}&accountName=${account}&tabs=1${getRealmParam(realm)}`;
  return rateLimiter.limit(
    axios.get<IStash>(poeUrl + '/character-window/get-stash-items' + parameters)
  );
}

function getItemsForTabs(tabs: IStashTab[], account: string, league: string, realm?: string) {
  if (tabs.length === 0) {
    return throwError(new Error('no_stash_tabs_selected_for_profile'));
  }

  return forkJoin(
    tabs.map((tab: IStashTab) => {
      return getStashTab(account, league, tab.i, realm).pipe(
        map((stash: AxiosResponse<IStash>) => {
          rootStore.uiStateStore.incrementStatusMessageCount();
          const items = {
            pricedItems: mapItemsToPricedItems(stash.data.items, tab),
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
  realm?: string
): Observable<AxiosResponse<ILeague[]>> {
  const parameters = `?type=${type}&compact=${compact}${getRealmParam(realm)}`;
  return rateLimiter.limit(
    axios.get<ILeague[]>(apiUrl + '/leagues' + parameters, { headers: null })
  );
}

function getCharacters(realm?: string): Observable<AxiosResponse<ICharacter[]>> {
  // todo: create util for this realm segment
  const parameters = `${getRealmParam(realm)}`;

  return rateLimiter.limit(
    axios.get<ICharacter[]>(poeUrl + '/character-window/get-characters' + parameters)
  );
}

function getCharacterItems(
  account: string,
  character: string,
  realm?: string
): Observable<AxiosResponse<ICharacterWithItems>> {
  const parameters = `?accountName=${account}&character=${character}${getRealmParam(realm)}`;

  return rateLimiter.limit(
    axios.get<ICharacterWithItems>(poeUrl + '/character-window/get-items' + parameters)
  );
}

function getProfile(realm?: string): Observable<AxiosResponse<IPoeProfile>> {
  const parameters = `${getRealmParam(realm)}`;

  return rateLimiter.limit(axios.get<IPoeProfile>(apiUrl + '/profile' + parameters));
}

function getRealmParam(realm?: string) {
  return realm !== undefined ? `&realm=${realm}` : '';
}

/* #endregion */

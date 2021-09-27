import { AxiosResponse } from 'axios';
import axios from 'axios-observable';
import { forkJoin, from, Observable, of, throwError } from 'rxjs';
import { concatMap, map, mergeMap } from 'rxjs/operators';
import { rootStore } from '..';
import { ICharacterListResponse, ICharacterResponse } from '../interfaces/character.interface';
import { IGithubRelease } from '../interfaces/github/github-release.interface';
import { IItem } from '../interfaces/item.interface';
import { ILeague } from '../interfaces/league.interface';
import { IPoeProfile } from '../interfaces/poe-profile.interface';
import { IPricedItem } from '../interfaces/priced-item.interface';
import { IStash, IStashTab, IStashTabResponse } from '../interfaces/stash.interface';
import { mapItemsToPricedItems } from '../utils/item.utils';
import { rateLimit } from '../utils/rxjs.utils';
import AppConfig from './../config/app.config';
import { IStashTabSnapshot } from './../interfaces/stash-tab-snapshot.interface';

const apiUrl = AppConfig.pathOfExileApiUrl;

export const externalService = {
  getLatestRelease,
  getStashTab,
  getStashTabs,
  getItemsForTab,
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
  return axios.get<IStashTabResponse>(`${apiUrl}/stash/${league}/${id}`);
}

function getStashTabs(league: string): Observable<AxiosResponse<IStash>> {
  return axios.get<IStash>(`${apiUrl}/stash/${league}`);
}

function getItemsForTab(stashTab: IStashTab, league: string) {
  const mapTabItems = (tab: IStashTab, items?: IItem[]) => {
    return items ? mapItemsToPricedItems(items, tab) : [];
  };

  const makeRequest = (tab: IStashTab) => {
    return getStashTab(league, tab.id).pipe(
      mergeMap((stashTab: AxiosResponse<IStashTabResponse>) => {
        rootStore.rateLimitStore.parseRateLimitHeaders(stashTab.headers['x-rate-limit-account']);
        rootStore.uiStateStore.incrementStatusMessageCount();
        const children = stashTab.data.stash.children;
        let finalizedItems: IPricedItem[] = [];
        if (children) {
          return from(children).pipe(
            rootStore.rateLimitStore.rateLimiter1,
            rootStore.rateLimitStore.rateLimiter2,
            concatMap((c: IStashTab) => {
              const prefix = c.parent ? `${c.parent}/` : '';
              return getStashTab(league, `${prefix}${c.id}`).pipe(
                map((ctab: AxiosResponse<IStashTabResponse>) => {
                  finalizedItems = finalizedItems.concat(mapTabItems(c, ctab.data.stash.items));
                  return {
                    ...{ stashTabId: tab.id },
                    ...{ pricedItems: finalizedItems },
                  } as IStashTabSnapshot;
                })
              );
            })
          );
        } else {
          const items = mapTabItems(tab, stashTab.data.stash.items);
          return of({
            ...{ stashTabId: tab.id },
            ...{ pricedItems: items },
          } as IStashTabSnapshot);
        }
      })
    );
  };

  const source = of(stashTab).pipe(
    rootStore.rateLimitStore.rateLimiter1,
    rootStore.rateLimitStore.rateLimiter2,
    concatMap((tab: IStashTab) => makeRequest(tab))
  );

  return source;
}

function getLeagues(
  type: string = 'main',
  compact: number = 1,
  realm: string = 'pc'
): Observable<AxiosResponse<ILeague[]>> {
  const parameters = `?type=${type}&compact=${compact}${getRealmParam(realm)}`;
  return axios.get<ILeague[]>(apiUrl + '/leagues' + parameters, { headers: null });
}

function getCharacters(): Observable<AxiosResponse<ICharacterListResponse>> {
  return axios.get<ICharacterListResponse>(`${apiUrl}/character`);
}

function getCharacter(character: string): Observable<AxiosResponse<ICharacterResponse>> {
  return axios.get<ICharacterResponse>(`${apiUrl}/character/${character}`);
}

function getProfile(realm: string = 'pc'): Observable<AxiosResponse<IPoeProfile>> {
  const parameters = `?realm=${realm}`;
  return axios.get<IPoeProfile>(apiUrl + '/profile' + parameters);
}

function getRealmParam(realm?: string) {
  return realm !== undefined ? `&realm=${realm}` : '';
}

/* #endregion */

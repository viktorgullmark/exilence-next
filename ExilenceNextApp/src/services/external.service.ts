import { AxiosResponse } from 'axios';
import axios from 'axios-observable';
import moment from 'moment';
import { from, Observable, of } from 'rxjs';
import { concatMap, delay, map } from 'rxjs/operators';
import { rootStore } from '..';
import { ICharacterListResponse, ICharacterResponse } from '../interfaces/character.interface';
import { IGithubRelease } from '../interfaces/github/github-release.interface';
import { ILeague } from '../interfaces/league.interface';
import { IPoeProfile } from '../interfaces/poe-profile.interface';
import { IStash, IStashTab, IStashTabResponse } from '../interfaces/stash.interface';
import AppConfig from './../config/app.config';

const apiUrl = AppConfig.pathOfExileApiUrl;

export const externalService = {
  getLatestRelease,
  getStashTab,
  getStashTabs,
  getStashTabWithChildren,
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

function getStashTabWithChildren(
  stashTab: IStashTab,
  league: string,
  children?: boolean,
  parseHeaders?: boolean
) {
  const makeRequest = (tab: IStashTab) => {
    const prefix = tab.parent && children ? `${tab.parent}/` : '';
    console.log(`req ${moment().format('LTS')}`);
    return getStashTab(league, `${prefix}${tab.id}`).pipe(
      map((stashTab: AxiosResponse<IStashTabResponse>) => {
        console.log(`res ${moment().format('LTS')}`);
        if (!children) {
          rootStore.uiStateStore.incrementStatusMessageCount();
        }
        if (parseHeaders) {
          rootStore.rateLimitStore.parseRateLimitHeaders(stashTab.headers['x-rate-limit-account']);
          if (rootStore.rateLimitStore.shouldUpdateLimits) {
            rootStore.rateLimitStore.updateLimits();
          }
        }
        rootStore.rateLimitStore.setLastRequestTimestamp(new Date());
        return stashTab.data.stash;
      }),
      delay(125)
    );
  };

  const outer = rootStore.rateLimitStore.getOuter;
  const inner = rootStore.rateLimitStore.getInner;
  const source = from(inner.removeTokens(1)).pipe(
    concatMap(() => {
      console.log(
        `removed token from inner ${moment().format('LTS')}, count:`,
        inner.tokensThisInterval
      );
      return from(outer.removeTokens(1)).pipe(
        concatMap(() => {
          console.log(
            `removed token from outer ${moment().format('LTS')}, count:`,
            outer.tokensThisInterval
          );
          return makeRequest(stashTab).pipe(
            concatMap((tabResponse) => {
              return of(tabResponse);
            })
          );
        })
      );
    })
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

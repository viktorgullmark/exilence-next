import * as Sentry from '@sentry/browser';
import { AxiosError, AxiosResponse } from 'axios';
import axios from 'axios-observable';
import { from, Observable, of, throwError } from 'rxjs';
import { catchError, concatMap, delay, map, mergeMap } from 'rxjs/operators';
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
  shouldInstantiate?: boolean
) {
  let innerLimiter;
  let outerLimiter;
  const makeRequest = (tab: IStashTab) => {
    const prefix = tab.parent && children ? `${tab.parent}/` : '';
    return getStashTab(league, `${prefix}${tab.id}`).pipe(
      map((stashTab: AxiosResponse<IStashTabResponse>) => {
        if (!children) {
          rootStore.uiStateStore.incrementStatusMessageCount();
        }
        const limits = rootStore.rateLimitStore.getLimitsFromHeaders(
          stashTab.headers['x-rate-limit-account']
        );
        const state = rootStore.rateLimitStore.getStateFromHeaders(
          stashTab.headers['x-rate-limit-account-state']
        );
        if (shouldInstantiate) {
          innerLimiter = rootStore.rateLimitStore.createInner(
            state.inner.tokens,
            limits.inner.tokens,
            limits.inner.interval
          );
          outerLimiter = rootStore.rateLimitStore.createOuter(
            state.outer.tokens,
            limits.outer.tokens,
            limits.outer.interval
          );
        }
        rootStore.rateLimitStore.setLastRequestTimestamp(new Date());
        rootStore.rateLimitStore.setLastRateLimitState(state);
        rootStore.rateLimitStore.setLastRateLimitBoundaries(limits);
        return { stash: stashTab.data.stash, limits, state };
      }),
      delay(125)
    );
  };

  if (shouldInstantiate) {
    return makeRequest(stashTab).pipe(
      concatMap((resp) => {
        return of(resp.stash);
      })
    );
  } else {
    innerLimiter = rootStore.rateLimitStore.inner;
    outerLimiter = rootStore.rateLimitStore.outer;
  }

  const source = from(
    Promise.all([outerLimiter.removeTokens(1), innerLimiter.removeTokens(1)])
  ).pipe(
    mergeMap(() => {
      return makeRequest(stashTab).pipe(
        mergeMap((response) => {
          if (
            outerLimiter.tokensThisInterval - 1 === outerLimiter.tokenBucket.tokensPerInterval &&
            outerLimiter.tokenBucket.tokensPerInterval !== response.limits.outer.tokens
          ) {
            rootStore.rateLimitStore.createOuter(
              0,
              response.limits.outer.tokens,
              response.limits.outer.interval
            );
          }
          if (
            innerLimiter.tokensThisInterval - 1 === innerLimiter.tokenBucket.tokensPerInterval &&
            innerLimiter.tokenBucket.tokensPerInterval !== response.limits.inner.tokens
          ) {
            rootStore.rateLimitStore.createInner(
              0,
              response.limits.inner.tokens,
              response.limits.inner.interval
            );
          }

          const delayToUse = 5000;

          // if we have few tokens (requests) left for inner interval, stall the next request
          const delayTime =
            response.limits &&
            response.state &&
            response.limits.inner.tokens + 3 <= response.state.inner.tokens
              ? delayToUse
              : 0;

          return of(response.stash).pipe(delay(delayTime));
        })
      );
    }),
    catchError((e: Error | AxiosError) => {
      if (e.message.indexOf('token') > -1) {
        Sentry.captureException(e);
      }
      return throwError(e);
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

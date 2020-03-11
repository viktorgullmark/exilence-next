import { AxiosError, AxiosResponse } from 'axios';
import { action, computed, observable, runInAction } from 'mobx';
import { persist } from 'mobx-persist';
import { fromStream } from 'mobx-utils';
import { forkJoin, of, throwError, timer } from 'rxjs';
import {
  catchError,
  concatMap,
  map,
  mergeMap,
  switchMap
} from 'rxjs/operators';
import { ICharacter } from '../interfaces/character.interface';
import { ICookie } from '../interfaces/cookie.interface';
import { ILeague } from '../interfaces/league.interface';
import { IOAuthResponse } from '../interfaces/oauth-response.interface';
import { IPoeProfile } from '../interfaces/poe-profile.interface';
import { IProfile } from '../interfaces/profile.interface';
import { IToken } from '../interfaces/token.interface';
import { externalService } from '../services/external.service';
import { getCharacterLeagues } from '../utils/league.utils';
import { electronService } from './../services/electron.service';
import { Account } from './domains/account';
import { RootStore } from './rootStore';

export class AccountStore {
  @persist('list', Account) @observable accounts: Account[] = [];
  @persist @observable activeAccount: string = '';
  @persist('object') @observable token: IToken | undefined = undefined;
  @observable code: string = '';
  @observable sessionId: string = '';

  constructor(private rootStore: RootStore) {}

  @computed
  get getSelectedAccount(): Account {
    const account = this.accounts.find(a => a.uuid === this.activeAccount);
    return account ? account : new Account();
  }

  @action
  selectAccountByName(name: string) {
    this.activeAccount = '';
    const account = this.findAccountByName(name);
    this.activeAccount = account!.uuid;
  }

  @action
  setActiveAccount(uuid: string) {
    this.activeAccount = uuid;
  }

  @action
  findAccountByName(name: string) {
    return this.accounts.find(a => a.name === name);
  }

  @action
  addOrUpdateAccount(name: string, sessionId: string) {
    let foundAccount = this.findAccountByName(name);

    if (foundAccount) {
      foundAccount.sessionId = sessionId;
      return foundAccount;
    } else {
      const newAccount = new Account({ name: name, sessionId: sessionId });
      this.accounts.push(newAccount);
      return newAccount;
    }
  }

  @action
  handleAuthCallback(url: string, window: any) {
    var raw_code = /code=([^&]*)/.exec(url) || null;
    var code = raw_code && raw_code.length > 1 ? raw_code[1] : null;
    var error = /\?error=(.+)$/.exec(url);

    if (code || error) {
      // Close the browser if code found or error
      window.destroy();
    }

    // If there is a code, proceed to get token from github
    if (code) {
      this.setCode(code);
      this.loginWithOAuth(code);
    } else if (error) {
      this.loginWithOAuthFail();
    }
  }

  @action
  setCode(code: string) {
    this.code = code;
  }

  @action
  loadAuthWindow() {
    var options = {
      clientId: 'exilence',
      scopes: ['profile'], // Scopes limit access for OAuth tokens.
      redirectUrl: 'http://localhost',
      state: 'yourstate',
      responseType: 'code'
    };

    var authWindow = new electronService.remote.BrowserWindow({
      width: 500,
      height: 750,
      show: false,
      autoHideMenuBar: true,
      'node-integration': false,
      fullscreenable: false,
      resizable: false,
      minimizable: false,
      maximizable: false,
      alwaysOnTop: true
    });

    var authUrl = `https://www.pathofexile.com/oauth/authorize?client_id=${options.clientId}&response_type=${options.responseType}&scope=${options.scopes}&state=${options.state}&redirect_uri=${options.redirectUrl}`;

    authWindow.webContents.on('will-redirect', (event: any, url: any) => {
      this.handleAuthCallback(url, authWindow);
    });

    // Reset the authWindow on close
    authWindow.on(
      'close',
      function() {
        authWindow = null;
      },
      false
    );

    authWindow.loadURL(authUrl);
    authWindow.show();
  }

  @action
  loginWithOAuth(code: string) {
    fromStream(
      externalService.loginWithOAuth(code).pipe(
        map((res: AxiosResponse<IOAuthResponse>) => {
          this.loginWithOAuthSuccess(res.data);
        }),
        catchError((e: AxiosError) => of(this.loginWithOAuthFail(e)))
      )
    );
  }

  @action
  loginWithOAuthSuccess(response: IOAuthResponse) {
    this.rootStore.routeStore.redirect('/net-worth');
    this.rootStore.uiStateStore.setValidated(true);
    this.rootStore.notificationStore.createNotification(
      'login_with_oauth',
      'success'
    );
    this.setToken(response);
    this.initSession();
  }

  @action
  getPoeProfile() {
    return externalService.getProfile(this.token!.accessToken).pipe(
      map((profile: AxiosResponse<IPoeProfile>) => {
        this.getPoeProfileSuccess();
        return profile.data;
      }),
      catchError(e => {
        this.getPoeProfileFail(e);
        return throwError(e);
      })
    );
  }

  @action
  getPoeProfileSuccess() {
    this.rootStore.notificationStore.createNotification(
      'get_poe_profile',
      'success'
    );
  }

  @action
  getPoeProfileFail(e: AxiosError | Error) {
    this.rootStore.notificationStore.createNotification(
      'get_poe_profile',
      'error',
      true,
      e
    );

    // todo: check expiry date here
    if (!this.token) {
      this.rootStore.routeStore.redirect('/login');
    }
  }

  @action
  loginWithOAuthFail(e?: AxiosError) {
    this.rootStore.notificationStore.createNotification(
      'login_with_oauth',
      'error',
      true,
      e
    );
    this.rootStore.routeStore.redirect('/login');
  }

  @action
  setToken(response: IOAuthResponse) {
    this.token = {
      accessToken: response.access_token,
      tokenType: response.token_type,
      scope: response.scope,
      expires: new Date(new Date().getTime() + +response.expires_in * 1000)
    };
  }

  @action
  initSession(skipAuth?: boolean) {
    this.rootStore.uiStateStore.setStatusMessage('initializing_session');
    this.rootStore.uiStateStore.setIsInitiating(true);

    if (!this.token) {
      this.initSessionFail(new Error('error:no_token_set'));
      return this.rootStore.routeStore.redirect('/login');
    }

    if (new Date().getTime() >= new Date(this.token.expires).getTime()) {
      this.initSessionFail(new Error('error:token_expired'));
      return this.rootStore.routeStore.redirect('/login');
    }

    fromStream(
      this.getPoeProfile().pipe(
        concatMap((res: IPoeProfile) => {
          const account = this.addOrUpdateAccount(res.name, this.sessionId);
          this.selectAccountByName(account.name!);
          return forkJoin(
            externalService.getLeagues(),
            externalService.getCharacters(),
            !skipAuth ? this.getSelectedAccount.authorize() : of({})
          ).pipe(
            concatMap(requests => {
              const leagues: ILeague[] = requests[0].data;
              const characters: ICharacter[] = requests[1].data;

              if (leagues.length === 0) {
                throw new Error('error:no_leagues');
              }
              if (characters.length === 0) {
                throw new Error('error:no_characters');
              }

              this.rootStore.leagueStore.updateLeagues(
                getCharacterLeagues(characters)
              );
              this.rootStore.leagueStore.updatePriceLeagues(
                leagues.filter(l => l.id.indexOf('SSF') === -1)
              );
              this.getSelectedAccount.updateAccountLeagues(characters);
              this.rootStore.priceStore.getPricesForLeagues();

              return forkJoin(
                of(account.accountLeagues).pipe(
                  concatMap(leagues => leagues),
                  concatMap(league => {
                    this.rootStore.uiStateStore.setStatusMessage(
                      'fetching_stash_tabs',
                      league.leagueId
                    );
                    return league.getStashTabs();
                  }),
                  switchMap(() => {
                    if (this.getSelectedAccount.profiles.length === 0) {
                      const newProfile: IProfile = {
                        name: 'profile 1',
                        activeLeagueId: this.getSelectedAccount
                          .accountLeagues[0].leagueId,
                        activePriceLeagueId: this.rootStore.leagueStore
                          .priceLeagues[0].id
                      };

                      const league = this.getSelectedAccount.accountLeagues.find(
                        al => al.leagueId === newProfile.activeLeagueId
                      );

                      if (league) {
                        runInAction(() => {
                          newProfile.activeStashTabIds = league.stashtabs
                            .slice(0, 6)
                            .map(lst => lst.id);
                        });
                        this.rootStore.uiStateStore.setStatusMessage(
                          'creating_default_profile',
                          newProfile.name
                        );
                        return this.getSelectedAccount
                          .createProfileObservable(newProfile, () => {})
                          .pipe(
                            map(() => {
                              this.rootStore.uiStateStore.setProfilesLoaded(
                                true
                              );
                            })
                          );
                      }
                      return throwError(new Error('error:league_not_found'));
                    }
                    return of({});
                  })
                )
              );
            })
          );
        }),
        switchMap(() => {
          if (this.rootStore.settingStore.autoSnapshotting) {
            return of(this.getSelectedAccount.queueSnapshot());
          } else {
            return of({});
          }
        }),
        switchMap(() => of(this.initSessionSuccess())),
        catchError((e: AxiosError) => {
          return of(this.initSessionFail(e));
        })
      )
    );
  }

  @action
  initSessionSuccess() {
    this.rootStore.uiStateStore.resetStatusMessage();
    this.rootStore.notificationStore.createNotification(
      'init_session',
      'success'
    );
    this.rootStore.uiStateStore.setIsInitiating(false);
    this.rootStore.uiStateStore.setInitiated(true);
  }

  @action
  initSessionFail(e: AxiosError | Error) {
    fromStream(timer(45 * 1000).pipe(switchMap(() => of(this.initSession()))));

    this.rootStore.uiStateStore.resetStatusMessage();
    this.rootStore.notificationStore.createNotification(
      'init_session',
      'error',
      true,
      e
    );
    this.rootStore.uiStateStore.setIsInitiating(false);
    this.rootStore.uiStateStore.setInitiated(true);
  }

  @action
  validateSession(sender: string, sessionId?: string) {
    this.rootStore.uiStateStore.setValidating(true);
    this.rootStore.uiStateStore.setSubmitting(true);

    const request = externalService.getCharacters().pipe(
      switchMap(() => of(this.validateSessionSuccess(sender, sessionId))),
      catchError((e: AxiosError) => of(this.validateSessionFail(e, sender)))
    );
    this.rootStore.uiStateStore.setStatusMessage('validating_session');
    fromStream(
      sessionId
        ? this.rootStore.uiStateStore.setSessIdCookie(sessionId).pipe(
            switchMap(() => {
              this.rootStore.uiStateStore.setStatusMessage(
                'fetching_characters'
              );
              return request;
            })
          )
        : this.rootStore.uiStateStore.getSessIdCookie().pipe(
            mergeMap((cookies: ICookie[]) => {
              this.rootStore.uiStateStore.setStatusMessage(
                'fetching_characters'
              );
              if (cookies && cookies.length > 0) {
                this.sessionId = cookies[0].value;
              }
              return request;
            })
          )
    );
  }

  @action
  validateSessionSuccess(sender: string, sessionId: string | undefined) {
    if (sessionId) {
      this.sessionId = sessionId;
    }

    this.rootStore.uiStateStore.resetStatusMessage();
    this.rootStore.notificationStore.createNotification(
      'validate_session',
      'success'
    );
    this.rootStore.uiStateStore.setSubmitting(false);
    this.rootStore.uiStateStore.setValidating(false);
    // todo: check expiry date
    if (!this.token || sessionId) {
      if (sender === '/login') {
        this.loadAuthWindow();
      } else {
        this.rootStore.routeStore.redirect('/login');
      }
    } else {
      this.rootStore.uiStateStore.setValidated(true);
      this.rootStore.routeStore.redirect('/net-worth');
      this.initSession();
    }
  }

  @action
  validateSessionFail(e: AxiosError | Error, sender: string) {
    if (sender !== '/login') {
      fromStream(
        timer(45 * 1000).pipe(switchMap(() => of(this.validateSession(sender))))
      );
    }

    this.rootStore.uiStateStore.resetStatusMessage();
    this.rootStore.notificationStore.createNotification(
      'validate_session',
      'error',
      true,
      e
    );
    this.rootStore.uiStateStore.setValidating(false);
    this.rootStore.uiStateStore.setSubmitting(false);
    this.rootStore.uiStateStore.setValidated(false);
  }
}

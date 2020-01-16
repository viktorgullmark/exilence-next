import { AxiosError, AxiosResponse } from 'axios';
import { action, computed, observable, runInAction } from 'mobx';
import { persist } from 'mobx-persist';
import { fromStream } from 'mobx-utils';
import { forkJoin, of, timer, throwError } from 'rxjs';
import {
  catchError,
  concatMap,
  map,
  mergeMap,
  switchMap
} from 'rxjs/operators';
import { stores } from '..';
import { ICookie } from '../interfaces/cookie.interface';
import { IOAuthResponse } from '../interfaces/oauth-response.interface';
import { IPoeProfile } from '../interfaces/poe-profile.interface';
import { IToken } from '../interfaces/token.interface';
import { externalService } from '../services/external.service';
import { ProfileUtils } from '../utils/profile.utils';
import { electronService } from './../services/electron.service';
import { Account } from './domains/account';
import { LeagueStore } from './leagueStore';
import { NotificationStore } from './notificationStore';
import { PriceStore } from './priceStore';
import { SignalrStore } from './signalrStore';
import { UiStateStore } from './uiStateStore';
import { IApiProfile } from '../interfaces/api/api-profile.interface';
import { Profile } from './domains/profile';
import { IProfile } from '../interfaces/profile.interface';

export class AccountStore {
  constructor(
    private uiStateStore: UiStateStore,
    private notificationStore: NotificationStore,
    private leagueStore: LeagueStore,
    private priceStore: PriceStore,
    private signalrStore: SignalrStore
  ) {}

  @persist('list', Account) @observable accounts: Account[] = [];
  @persist @observable activeAccount: string = '';
  @persist('object') @observable token: IToken | undefined = undefined;
  @observable code: string = '';
  @observable sessionId: string = '';

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

    authWindow.webContents.on('will-redirect', function(event: any, url: any) {
      stores.accountStore.handleAuthCallback(url, authWindow);
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
    this.uiStateStore.setValidated(true);
    this.notificationStore.createNotification('login_with_oauth', 'success');
    this.setToken(response);
    this.initSession();
  }

  @action
  getPoeProfile() {
    if (!this.token) {
      this.getPoeProfileFail(new Error('error:no_token_set'));
    }

    return externalService.getProfile(this.token!.accessToken);
  }

  @action
  getPoeProfileSuccess() {
    this.notificationStore.createNotification('get_poe_profile', 'success');
  }

  @action
  getPoeProfileFail(e: AxiosError | Error) {
    this.notificationStore.createNotification(
      'get_poe_profile',
      'error',
      true,
      e
    );

    // todo: check expiry date here
    if (!this.token) {
      this.uiStateStore.redirect('/login');
    }
  }

  @action
  loginWithOAuthFail(e?: AxiosError) {
    this.notificationStore.createNotification(
      'login_with_oauth',
      'error',
      true,
      e
    );
    this.uiStateStore.redirect('/login');
  }

  @action
  setToken(response: IOAuthResponse) {
    this.token = {
      accessToken: response.access_token,
      expiresIn: response.expires_in,
      tokenType: response.token_type,
      scope: response.scope
    };
  }

  @action
  initSession() {
    this.uiStateStore.setIsInitiating(true);
    fromStream(
      this.getPoeProfile().pipe(
        concatMap((res: AxiosResponse<IPoeProfile>) => {
          this.getPoeProfileSuccess();
          const account = this.addOrUpdateAccount(
            res.data.name,
            this.sessionId
          );
          this.selectAccountByName(account.name!);
          return forkJoin(
            externalService.getLeagues(),
            externalService.getCharacters()
          )
            .pipe(
              concatMap(requests => {
                const retrievedLeagues = requests[0].data;
                const retrievedCharacters = requests[1].data;

                if (retrievedLeagues.length === 0) {
                  throw new Error('error:no_leagues');
                }
                if (retrievedCharacters.length === 0) {
                  throw new Error('error:no_characters');
                }

                this.leagueStore.updateLeagues(retrievedLeagues);
                this.getSelectedAccount.updateAccountLeagues(
                  retrievedCharacters
                );
                this.priceStore.getPricesForLeagues();

                return forkJoin(
                  this.getSelectedAccount.authorize(),
                  forkJoin(
                    of(account.accountLeagues).pipe(
                      concatMap(leagues => leagues),
                      concatMap(league => {
                        return league.getStashTabs();
                      })
                    )
                  ).pipe(
                    switchMap(() => {
                      if (this.getSelectedAccount.profiles.length === 0) {
                        const newProfile: IProfile = {
                          name: 'profile 1',
                          activeLeagueId: this.getSelectedAccount
                            .accountLeagues[0].leagueId,
                          activePriceLeagueId:
                            stores.leagueStore.priceLeagues[0].id
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
                          return this.getSelectedAccount
                            .createProfileObservable(newProfile, () => {})
                            .pipe(
                              map(() => {
                                stores.uiStateStore.setProfilesLoaded(true);
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
            )
            .pipe(
              switchMap(() => of(this.initSessionSuccess())),
              catchError((e: AxiosError) => {
                return of(this.initSessionFail(e));
              })
            );
        }),
        catchError((e: AxiosError) => of(this.getPoeProfileFail(e)))
      )
    );
  }

  @action
  initSessionSuccess() {
    this.notificationStore.createNotification('init_session', 'success');
    this.uiStateStore.setIsInitiating(false);
    this.uiStateStore.setInitiated(true);
  }

  @action
  initSessionFail(e: AxiosError | Error) {
    fromStream(timer(15 * 1000).pipe(switchMap(() => of(this.initSession()))));

    this.notificationStore.createNotification('init_session', 'error', true, e);
    this.uiStateStore.setIsInitiating(false);
    this.uiStateStore.setInitiated(true);
  }

  @action
  validateSession(sender: string, sessionId?: string) {
    this.uiStateStore.setSubmitting(true);

    const request = externalService.getCharacters().pipe(
      switchMap(() => of(this.validateSessionSuccess(sender, sessionId))),
      catchError((e: AxiosError) => of(this.validateSessionFail(e, sender)))
    );
    fromStream(
      sessionId
        ? this.uiStateStore.setSessIdCookie(sessionId).pipe(
            switchMap(() => {
              return request;
            })
          )
        : this.uiStateStore.getSessIdCookie().pipe(
            mergeMap((cookies: ICookie[]) => {
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

    this.notificationStore.createNotification('validate_session', 'success');
    this.uiStateStore.setSubmitting(false);

    // todo: check expiry date
    if (!this.token || sessionId) {
      this.uiStateStore.redirect('/login');
      this.loadAuthWindow();
    } else {
      this.uiStateStore.setValidated(true);
      this.initSession();
    }
  }

  @action
  validateSessionFail(e: AxiosError | Error, sender: string) {
    if (sender !== '/login') {
      fromStream(
        timer(15 * 1000).pipe(switchMap(() => of(this.validateSession(sender))))
      );
    }

    this.notificationStore.createNotification(
      'validate_session',
      'error',
      true,
      e
    );
    this.uiStateStore.setSubmitting(false);
    this.uiStateStore.setValidated(false);
  }
}

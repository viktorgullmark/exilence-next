import { AxiosError, AxiosResponse } from 'axios';
import { action, computed, observable } from 'mobx';
import { persist } from 'mobx-persist';
import { fromStream } from 'mobx-utils';
import { forkJoin, of, timer } from 'rxjs';
import { catchError, concatMap, map, switchMap } from 'rxjs/operators';
import { stores } from '..';
import { IAccount } from '../interfaces/account.interface';
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

export class AccountStore {
  constructor(
    private uiStateStore: UiStateStore,
    private notificationStore: NotificationStore,
    private leagueStore: LeagueStore,
    private priceStore: PriceStore,
    private signalrStore: SignalrStore
  ) { }

  @persist('list', Account) @observable accounts: Account[] = [];
  @persist @observable activeAccount: string = '';
  @persist @observable code: string = '';
  @observable token: IToken | undefined = undefined;

  @computed
  get getSelectedAccount(): Account {
    const account = this.accounts.find(a => a.uuid === this.activeAccount);
    return account ? account : new Account();
  }

  @action
  selectAccountByName(name: string) {
    this.activeAccount = '';
    const account = this.findAccount({ name: name });
    this.activeAccount = account!.uuid;
  }

  @action
  findAccount(details: IAccount) {
    if (details.name) {
      return this.accounts.find(a => a.name === details.name);
    } else if (details.sessionId) {
      return this.accounts.find(a => a.sessionId === details.sessionId);
    }
  }

  @action
  addOrUpdateAccount(details: IAccount) {
    let foundAccount = this.findAccount(details);

    if (foundAccount) {
      if (details.name) {
        foundAccount.name = details.name;
      }
      if (details.sessionId) {
        foundAccount.sessionId = details.sessionId;
      }
      return foundAccount;
    } else {
      const newAccount = new Account(details);
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
      alert(
        "Oops! Something went wrong and we couldn't" +
        'log you in using Github. Please try again.'
      );
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

    authWindow.webContents.on('will-redirect', function (event: any, url: any) {
      stores.accountStore.handleAuthCallback(url, authWindow);
    });

    // Reset the authWindow on close
    authWindow.on(
      'close',
      function () {
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
  }

  @action
  loginWithOAuthFail(e: AxiosError) {
    this.notificationStore.createNotification(
      'login_with_oauth',
      'error',
      true,
      e
    );
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
          const details: IAccount = { name: res.data.name };
          const account = this.addOrUpdateAccount(details);
          this.selectAccountByName(account.name!);
          return forkJoin(
            externalService.getLeagues(),
            externalService.getCharacters()
          ).pipe(
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
              this.getSelectedAccount.updateAccountLeagues(retrievedCharacters);
              this.getSelectedAccount.checkDefaultProfile();
              this.priceStore.getPricesForLeagues();

              return this.getSelectedAccount
                .authorize(
                  this.getSelectedAccount.profiles.map(p =>
                    ProfileUtils.mapProfileToApiProfile(p)
                  )
                )
                .pipe(switchMap(() => of(this.initSessionSuccess())));
            }),
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
  }

  @action
  initSessionFail(e: AxiosError | Error) {
    // todo: retry logic

    this.notificationStore.createNotification('init_session', 'error', true, e);
    this.uiStateStore.setIsInitiating(false);
  }

  @action
  validateSession(sender: string, sessionId?: string) {
    const request = sessionId
      ? this.uiStateStore.setSessIdCookie(sessionId)
      : of();
    fromStream(
      request.pipe(
        switchMap(() => {
          return externalService.getCharacters().pipe(
            switchMap(() => of(this.validateSessionSuccess(sessionId))),
            catchError((e: AxiosError) =>
              of(this.validateSessionFail(e, sender))
            )
          );
        })
      )
    );
  }

  @action
  validateSessionSuccess(sessionId: string | undefined) {
    this.addOrUpdateAccount({ sessionId: sessionId });

    this.notificationStore.createNotification('validate_session', 'success');
    this.uiStateStore.setSubmitting(false);
    this.uiStateStore.setValidated(true);

    this.loadAuthWindow();

    // const profile = this.getSelectedAccount.activeProfile;

    // if (profile.shouldSetStashTabs) {
    //   const league = this.getSelectedAccount.accountLeagues.find(
    //     al => al.leagueId === profile.activeLeagueId
    //   );

    //   if (league && profile.shouldSetStashTabs) {
    //     profile.setActiveStashTabs(
    //       league.stashtabs.slice(0, 6).map(lst => lst.id)
    //     );

    //     this.signalrStore.updateProfile(
    //       ProfileUtils.mapProfileToApiProfile(profile)
    //     );

    //     runInAction(() => {
    //       profile.shouldSetStashTabs = false;
    //     });
    //   }
    // }
  }

  @action
  validateSessionFail(e: AxiosError | Error, sender: string) {
    // retry validate session if it fails
    if (sender !== '/login') {
      fromStream(
        timer(30 * 1000).pipe(switchMap(() => of(this.validateSession(sender))))
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
    // this.uiStateStore.setIsInitiating(false);
  }
}

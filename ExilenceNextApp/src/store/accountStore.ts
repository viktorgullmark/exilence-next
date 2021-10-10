import { AxiosError, AxiosResponse } from 'axios';
import axios from 'axios-observable';
import { action, autorun, computed, makeObservable, observable, runInAction } from 'mobx';
import { persist } from 'mobx-persist';
import { fromStream } from 'mobx-utils';
import { forkJoin, of, Subject, throwError, timer } from 'rxjs';
import { catchError, concatMap, map, switchMap, takeUntil } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import AppConfig from '../config/app.config';
import { ICharacter } from '../interfaces/character.interface';
import { ILeague } from '../interfaces/league.interface';
import { IOAuthResponse } from '../interfaces/oauth-response.interface';
import { IPoeProfile } from '../interfaces/poe-profile.interface';
import { IProfile } from '../interfaces/profile.interface';
import { IToken } from '../interfaces/token.interface';
import { externalService } from '../services/external.service';
import { getCharacterLeagues } from '../utils/league.utils';
import { openCustomLink } from '../utils/window.utils';
import { electronService } from './../services/electron.service';
import { Account } from './domains/account';
import { RootStore } from './rootStore';

export class AccountStore {
  @persist('list', Account) @observable accounts: Account[] = [];
  @persist @observable activeAccount: string = '';
  @persist('object') @observable token: IToken | undefined = undefined;
  @observable code: string = '';
  @observable authState: string = uuidv4();

  cancelledRetry: Subject<boolean> = new Subject();

  constructor(private rootStore: RootStore) {
    makeObservable(this);
    electronService.ipcRenderer.on('auth-callback', (_event, { code, error }) => {
      this.handleAuthCallback(code, error);
    });

    autorun(() => {
      if (this.getSelectedAccount?.activeLeague) {
        rootStore.uiStateStore.setSelectedPriceTableLeagueId(
          this.getSelectedAccount?.activeLeague.id
        );
      }
    });
  }

  @computed
  get getSelectedAccount(): Account {
    const account = this.accounts.find((a) => a.uuid === this.activeAccount);
    return account ? account : new Account();
  }

  @computed
  get authUrl(): string {
    const options = {
      clientId: 'exilence',
      scopes: 'account:stashes account:profile account:characters', // Scopes limit access for OAuth tokens.
      redirectUrl: AppConfig.redirectUrl,
      state: this.authState,
      responseType: 'code',
      token: '',
    };

    return `https://www.pathofexile.com/oauth/authorize?client_id=${options.clientId}&response_type=${options.responseType}&scope=${options.scopes}&state=${options.state}&redirect_uri=${options.redirectUrl}`;
  }

  @action
  cancelRetries() {
    this.cancelledRetry.next(true);
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
    return this.accounts.find((a) => a.name === name);
  }

  @action
  addOrUpdateAccount(name: string) {
    const foundAccount = this.findAccountByName(name);

    if (foundAccount) {
      return foundAccount;
    } else {
      const newAccount = new Account({ name: name });
      this.accounts.push(newAccount);
      return newAccount;
    }
  }

  @action
  handleAuthCallback(code: string, error: string) {
    // If there is a code, proceed to get token
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
  loadOAuthPage() {
    openCustomLink(this.authUrl);
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
    this.rootStore.notificationStore.createNotification('login_with_oauth', 'success');
    this.setToken(response);
    // todo: implement refresh logic based on expiry
    fromStream(timer(1 * 1000).pipe(switchMap(() => of(this.initSession()))));
  }

  @action
  getPoeProfile() {
    return externalService.getProfile().pipe(
      map((profile: AxiosResponse<IPoeProfile>) => {
        this.getPoeProfileSuccess();
        return profile.data;
      }),
      catchError((e) => {
        this.getPoeProfileFail(e);
        return throwError(e);
      })
    );
  }

  @action
  getPoeProfileSuccess() {
    this.rootStore.notificationStore.createNotification('get_poe_profile', 'success');
  }

  @action
  getPoeProfileFail(e: AxiosError | Error) {
    this.rootStore.notificationStore.createNotification('get_poe_profile', 'error', true, e);

    // todo: check expiry date here
    if (!this.token) {
      this.rootStore.routeStore.redirect('/login');
    }
  }

  @action
  loginWithOAuthFail(e?: AxiosError) {
    this.rootStore.notificationStore.createNotification('login_with_oauth', 'error', true, e);
    this.rootStore.routeStore.redirect('/login');
  }

  @action
  setToken(response: IOAuthResponse) {
    this.token = {
      accessToken: response.access_token,
      tokenType: response.token_type,
      scope: response.scope,
      expires: new Date(new Date().getTime() + +response.expires_in * 1000),
    };
    axios.defaults.headers.common['Authorization'] = `Bearer ${this.token.accessToken}`;
  }

  @action
  clearToken() {
    this.token = undefined;
    axios.defaults.headers.common['Authorization'] = '';
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
      this.initSessionFail(new Error('error:token_expired_meta'));
      return this.rootStore.routeStore.redirect('/login', 'error:token_expired');
    }

    fromStream(
      this.getPoeProfile().pipe(
        concatMap((res: IPoeProfile) => {
          const account = this.addOrUpdateAccount(res.name);
          this.selectAccountByName(account.name!);

          return forkJoin(
            externalService.getLeagues('main', 1, res.realm),
            externalService.getCharacters(),
            !skipAuth ? this.getSelectedAccount.authorize() : of({})
          ).pipe(
            concatMap((requests) => {
              const leagues: ILeague[] = requests[0].data;
              const characters: ICharacter[] = requests[1].data.characters;
              const unsupportedLeagues = ['Path of Exile: Royale'];

              if (leagues.length === 0) {
                throw new Error('error:no_leagues');
              }
              if (characters.length === 0) {
                throw new Error('error:no_characters');
              }

              const filteredPriceLeagues = leagues.filter(
                (league) =>
                  !unsupportedLeagues.includes(league.id) && league.id.indexOf('SSF') === -1
              );
              this.rootStore.leagueStore.updateLeagues(getCharacterLeagues(characters));
              this.rootStore.leagueStore.updatePriceLeagues(filteredPriceLeagues);
              this.getSelectedAccount.updateAccountLeagues(characters);
              this.getSelectedAccount.updateLeaguesForProfiles(
                leagues.concat(getCharacterLeagues(characters)).map((l) => l.id)
              );

              // at initial launch, fetch prices for all leagues
              this.rootStore.priceStore.getPricesForLeagues(
                this.rootStore.leagueStore.priceLeagues.map((l) => l.id)
              );

              return forkJoin(
                of(account.accountLeagues).pipe(
                  concatMap((leagues) => leagues),
                  concatMap((league) => {
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
                        activeLeagueId: this.getSelectedAccount.accountLeagues[0].leagueId,
                        activePriceLeagueId: this.rootStore.leagueStore.priceLeagues[0].id,
                      };

                      const league = this.getSelectedAccount.accountLeagues.find(
                        (al) => al.leagueId === newProfile.activeLeagueId
                      );

                      if (league) {
                        runInAction(() => {
                          newProfile.activeStashTabIds = league.stashtabs
                            .slice(0, 2)
                            .map((lst) => lst.id);
                        });
                        this.rootStore.uiStateStore.setStatusMessage(
                          'creating_default_profile',
                          newProfile.name
                        );
                        return this.getSelectedAccount
                          .createProfileObservable(newProfile, () => {})
                          .pipe(
                            map(() => {
                              this.rootStore.uiStateStore.setProfilesLoaded(true);
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
    this.rootStore.notificationStore.createNotification('init_session', 'success');
    this.rootStore.uiStateStore.setIsInitiating(false);
    this.rootStore.uiStateStore.setInitiated(true);

    if (this.rootStore.settingStore.autoSnapshotting) {
      this.getSelectedAccount.queueSnapshot(1);
    }
  }

  @action
  initSessionFail(e: AxiosError | Error) {
    if (this.rootStore.routeStore.redirectedTo !== '/login') {
      fromStream(
        timer(45 * 1000).pipe(
          switchMap(() => of(this.initSession())),
          takeUntil(this.cancelledRetry)
        )
      );
    }

    this.rootStore.uiStateStore.resetStatusMessage();
    this.rootStore.notificationStore.createNotification('init_session', 'error', true, e);
    this.rootStore.uiStateStore.setIsInitiating(false);
    this.rootStore.uiStateStore.setInitiated(true);
  }

  @action
  validateSession(sender: string) {
    this.rootStore.uiStateStore.setValidating(true);
    this.rootStore.uiStateStore.setSubmitting(true);
    this.rootStore.uiStateStore.setStatusMessage('validating_session');
    this.validateSessionSuccess(sender);
  }

  @action
  validateSessionSuccess(sender: string) {
    this.rootStore.uiStateStore.resetStatusMessage();
    this.rootStore.notificationStore.createNotification('validate_session', 'success');
    this.rootStore.uiStateStore.setSubmitting(false);
    this.rootStore.uiStateStore.setValidating(false);
    // todo: check expiry date
    if (!this.token) {
      if (sender === '/login') {
        this.loadOAuthPage();
      } else {
        this.rootStore.routeStore.redirect('/login');
      }
    } else {
      axios.defaults.headers.common['Authorization'] = `Bearer ${this.token.accessToken}`;
      this.rootStore.uiStateStore.setValidated(true);
      this.rootStore.routeStore.redirect('/net-worth');
      fromStream(timer(1 * 1000).pipe(switchMap(() => of(this.initSession()))));
    }
  }

  @action
  validateSessionFail(e: AxiosError | Error, sender: string) {
    if (sender !== '/login') {
      fromStream(
        timer(45 * 1000).pipe(
          switchMap(() => of(this.validateSession(sender))),
          takeUntil(this.cancelledRetry)
        )
      );
    }

    this.rootStore.uiStateStore.resetStatusMessage();
    this.rootStore.notificationStore.createNotification('validate_session', 'error', true, e);
    this.rootStore.uiStateStore.setValidating(false);
    this.rootStore.uiStateStore.setSubmitting(false);
    this.rootStore.uiStateStore.setValidated(false);
  }
}

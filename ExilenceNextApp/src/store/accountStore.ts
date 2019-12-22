import { AxiosError } from 'axios';
import { action, computed, observable, reaction, runInAction } from 'mobx';
import { persist } from 'mobx-persist';
import { fromStream } from 'mobx-utils';
import { forkJoin, of, timer } from 'rxjs';
import { catchError, concatMap, map, switchMap } from 'rxjs/operators';
import { IAccount } from '../interfaces/account.interface';
import { externalService } from '../services/external.service';
import { ProfileUtils } from '../utils/profile.utils';
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
  addOrUpdateAccount(details: IAccount) {
    let acc = this.findAccountByName(details.name);
    acc
      ? acc.setSessionId(details.sessionId)
      : this.accounts.push(new Account(details));
  }

  @action
  initSession(sender: string, newAccount?: IAccount) {
    this.uiStateStore.setInitiated(true);
    this.uiStateStore.setIsInitiating(true);
    let account: IAccount;

    if (!newAccount) {
      account = {
        name: this.getSelectedAccount.name,
        sessionId: this.getSelectedAccount.sessionId
      };
    } else {
      account = newAccount;
      reaction(
        () => this.uiStateStore.sessIdCookie,
        (_cookie, reaction) => {
          this.initSessionSuccess(sender);
          reaction.dispose();
        }
      );
    }

    this.uiStateStore.setSubmitting(true);

    fromStream(
      forkJoin(
        externalService.getLeagues(),
        externalService.getCharacters(account.name)
      ).pipe(
        map(requests => {
          const retrievedLeagues = requests[0].data;
          const retrievedCharacters = requests[1].data;

          if (retrievedLeagues.length === 0) {
            throw new Error('error:no_leagues');
          }
          if (retrievedCharacters.length === 0) {
            throw new Error('error:no_characters');
          }

          if (newAccount) {
            this.addOrUpdateAccount(account);
            this.selectAccountByName(account.name);
          }

          this.leagueStore.updateLeagues(retrievedLeagues);
          this.getSelectedAccount.updateAccountLeagues(retrievedCharacters);
          this.getSelectedAccount.checkDefaultProfile();

          // todo: should return observable
          this.priceStore.getPricesForLeagues();

          this.getSelectedAccount.authorize(this.getSelectedAccount.profiles.map(p => ProfileUtils.mapProfileToApiProfile(p)));
        }),
        switchMap(() => {
          return newAccount
            ? this.uiStateStore.setSessIdCookie(account.sessionId)
            : of(this.initSessionSuccess(sender));
        }),
        catchError((e: AxiosError) => {
          return of(this.initSessionFail(e, sender, newAccount));
        })
      )
    );
  }

  @action
  initSessionSuccess(sender: string) {
    this.notificationStore.createNotification('init_session', 'success');
    this.validateSession(sender);
  }

  @action
  initSessionFail(
    e: AxiosError | Error,
    sender: string,
    newAccount?: IAccount
  ) {
    // retry init session if it fails
    if (sender !== '/login') {
      fromStream(
        timer(30 * 1000).pipe(
          switchMap(() => of(this.initSession(sender, newAccount)))
        )
      );
    }

    this.notificationStore.createNotification('init_session', 'error', true, e);
    this.uiStateStore.setSubmitting(false);
    this.uiStateStore.setIsInitiating(false);
  }

  @action
  validateSession(sender: string) {
    const acc = this.getSelectedAccount;
    this.uiStateStore.setIsInitiating(true);
    fromStream(
      forkJoin(
        of(acc.accountLeagues).pipe(
          concatMap(leagues => leagues),
          concatMap(league => {
            return league.getStashTabs();
          })
        )
      ).pipe(
        switchMap(() => of(this.validateSessionSuccess())),
        catchError((e: AxiosError) => of(this.validateSessionFail(e, sender)))
      )
    );
  }

  @action
  validateSessionSuccess() {
    this.notificationStore.createNotification('validate_session', 'success');
    this.uiStateStore.setSubmitting(false);
    this.uiStateStore.setValidated(true);
    this.uiStateStore.setIsInitiating(false);
    const profile = this.getSelectedAccount.activeProfile;

    if (profile.shouldSetStashTabs) {
      const league = this.getSelectedAccount.accountLeagues.find(
        al => al.leagueId === profile.activeLeagueId
      );

      if (league && profile.shouldSetStashTabs) {
        profile.setActiveStashTabs(
          league.stashtabs.slice(0, 6).map(lst => lst.id)
        );

        this.signalrStore.updateProfile(
          ProfileUtils.mapProfileToApiProfile(profile)
        );

        runInAction(() => {
          profile.shouldSetStashTabs = false;
        });
      }
    }
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
    this.uiStateStore.setIsInitiating(false);
  }
}

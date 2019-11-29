import { action, computed, observable, reaction, runInAction } from 'mobx';
import { persist } from 'mobx-persist';
import { fromStream } from 'mobx-utils';
import { forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { NotificationType } from '../enums/notification-type.enum';
import { IAccount } from '../interfaces/account.interface';
import { externalService } from '../services/external.service';
import { Account } from './domains/account';
import { LeagueStore } from './leagueStore';
import { NotificationStore } from './notificationStore';
import { PriceStore } from './priceStore';
import { UiStateStore } from './uiStateStore';

export class AccountStore {
  constructor(
    private uiStateStore: UiStateStore,
    private notificationStore: NotificationStore,
    private leagueStore: LeagueStore,
    private priceStore: PriceStore
  ) {}

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
  initSession(newAccount?: IAccount) {
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
          this.initSessionSuccess();
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
          this.priceStore.getPricesForLeagues();
          this.getSelectedAccount.updateAccountLeagues(retrievedCharacters);
          this.getSelectedAccount.checkDefaultProfile();
          this.getSelectedAccount.authorize();
        }),
        switchMap(() => {
          return newAccount
            ? this.uiStateStore.setSessIdCookie(account.sessionId)
            : of(this.initSessionSuccess());
        }),
        catchError((e: Error) => {
          return of(this.initSessionFail(e));
        })
      )
    );
  }

  @action
  initSessionSuccess() {
    this.notificationStore.createNotification(
      'init_session',
      NotificationType.Success
    );
    this.validateSession();
  }

  @action
  initSessionFail(error: Error | string) {
    this.notificationStore.createNotification(
      'init_session',
      NotificationType.Error
    );
    this.uiStateStore.setSubmitting(false);
  }

  @action
  validateSession() {
    this.uiStateStore.setValidated(false);
    const acc = this.getSelectedAccount;

    fromStream(
      of(acc.accountLeagues)
        .pipe(
          map(leagues => {
            leagues.map(league => {
              league.getStashTabs();
            });
          })
        )
        .pipe(
          map(() => {
            this.validateSessionSuccess();
          }),
          catchError((e: Error) => of(this.validateSessionFail(e)))
        )
    );
  }

  @action
  validateSessionSuccess() {
    this.notificationStore.createNotification(
      'validate_session',
      NotificationType.Success
    );
    this.uiStateStore.setSubmitting(false);
    this.uiStateStore.setValidated(true);
  }

  @action
  validateSessionFail(error: Error | string) {
    this.notificationStore.createNotification(
      'validate_session',
      NotificationType.Error
    );
    this.uiStateStore.setSubmitting(false);
    this.uiStateStore.setValidated(false);
  }
}

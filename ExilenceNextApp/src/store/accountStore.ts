import { action, computed, observable, reaction, runInAction } from 'mobx';
import { persist } from 'mobx-persist';
import { fromStream } from 'mobx-utils';
import { forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { IAccount } from '../interfaces/account.interface';
import { externalService } from '../services/external.service';
import { Account } from './domains/account';
import { LeagueStore } from './leagueStore';
import { NotificationStore } from './notificationStore';
import { PriceStore } from './priceStore';
import { UiStateStore } from './uiStateStore';
import { NotificationType } from '../enums/notification-type.enum';
import { AxiosResponse } from 'axios';
import { IStash } from '../interfaces/stash.interface';

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
  addAccount(details: IAccount) {
    let acc = this.findAccountByName(details.name);
    acc
      ? acc.setSessionId(details.sessionId)
      : this.accounts.push(new Account(details));
  }

  @action
  initSession(details?: IAccount) {
    this.uiStateStore.setSubmitting(true);

    fromStream(
      forkJoin(
        externalService.getLeagues(),
        externalService.getCharacters(details!.name)
      ).pipe(
        map(requests => {
          if (requests[0].data.length === 0) {
            throw new Error('error:no_leagues');
          }
          if (requests[1].data.length === 0) {
            throw new Error('error:no_characters');
          }
          if (details) {
            this.addAccount(details);
            this.selectAccountByName(details.name);
          }
          const acc = this.getSelectedAccount;
          this.leagueStore.updateLeagues(requests[0].data);

          // todo: create separate action
          this.leagueStore.priceLeagues.forEach(l => {
            this.priceStore.getPricesForLeague(l.uuid);
          });

          // todo: make sure leagues are set here
          acc!.mapAccountLeagues(
            this.leagueStore.leagues,
            requests[1].data,
            this.leagueStore.priceLeagues
          );
        }),
        switchMap(() => {
          return this.uiStateStore.setSessIdCookie(details!.sessionId);
        }),
        catchError((e: Error) => {
          return of(this.initSessionFail(e));
        })
      )
    );

    reaction(
      () => this.uiStateStore.sessIdCookie,
      (_cookie, reaction) => {
        this.initSessionSuccess();
        reaction.dispose();
      }
    );
  }

  @action
  initSessionSuccess() {
    this.notificationStore.createNotification({
      title: 'init_session',
      description: 'init_session',
      type: NotificationType.Success
    });
    this.validateSession();
  }

  @action
  initSessionFail(error: Error | string) {
    this.notificationStore.createNotification({
      title: 'init_session',
      description: 'init_session',
      type: NotificationType.Error
    });
    this.uiStateStore.setSubmitting(false);

    console.error(error);
  }

  @action
  validateSession() {
    this.uiStateStore.setValidated(false);
    const acc = this.getSelectedAccount;
    const leagueWithChar = acc.accountLeagues[0];

    const league = this.leagueStore!.leagues.find(
      l => l.uuid === leagueWithChar.uuid
    );

    leagueWithChar && league
      ? fromStream(
          externalService.getStashTabs(acc.name, league.id).pipe(
            map(() => this.validateSessionSuccess()),
            catchError((e: Error) => of(this.validateSessionFail(e)))
          )
        )
      : this.validateSessionFail('error:no_characters_in_leagues');
  }

  @action
  validateSessionSuccess() {
    this.notificationStore.createNotification({
      title: 'validate_session',
      description: 'validate_session',
      type: NotificationType.Success
    });
    this.uiStateStore.setSubmitting(false);
    this.uiStateStore.setValidated(true);
  }

  @action
  validateSessionFail(error: Error | string) {
    this.notificationStore.createNotification({
      title: 'validate_session',
      description: 'validate_session',
      type: NotificationType.Error
    });
    this.uiStateStore.setSubmitting(false);
    this.uiStateStore.setValidated(false);
    console.error(error);
  }
}

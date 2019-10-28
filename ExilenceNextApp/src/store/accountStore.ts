import { action, computed, observable, reaction } from 'mobx';
import { persist } from 'mobx-persist';
import { fromStream } from 'mobx-utils';
import { forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { IAccount } from '../interfaces/account.interface';
import { externalService } from '../services/external.service';
import { Account } from './domains/account';
import { NotificationStore } from './notificationStore';
import { UiStateStore } from './uiStateStore';

export class AccountStore {
  constructor(
    private uiStateStore: UiStateStore,
    private notificationStore: NotificationStore
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
    this.uiStateStore.loginStepper.setSubmitting(true);

    fromStream(
      forkJoin(
        externalService.getLeagues(),
        externalService.getCharacters(details!.name)
      ).pipe(
        map(requests => {
          if (requests[0].data.length === 0) {
            throw new Error('error.no_leagues');
          }
          if (requests[1].data.length === 0) {
            throw new Error('error.no_characters');
          }
          if (details) {
            this.addAccount(details);
            this.selectAccountByName(details.name);
          }
          const acc = this.getSelectedAccount;
          acc!.updateLeagues(requests[0].data);
          acc!.addCharactersToLeagues(requests[1].data);
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
      title: 'action.success.title.init_session',
      description: 'action.success.desc.init_session'
    });
    this.validateSession();
  }

  @action
  initSessionFail(error: Error | string) {
    this.notificationStore.createNotification({
      title: 'action.fail.title.init_session',
      description: 'action.fail.desc.init_session'
    });
    this.uiStateStore.loginStepper.setSubmitting(false);
  
    console.error(error);
  }

  @action
  validateSession() {
    const acc = this.getSelectedAccount;
    const leagueWithChar = acc.leagueWithCharacters;

    leagueWithChar
      ? fromStream(
          externalService.getStashTabs(acc.name, leagueWithChar.id).pipe(
            map(() => this.validateSessionSuccess()),
            catchError((e: Error) => of(this.validateSessionFail(e)))
          )
        )
      : this.validateSessionFail('error.no_characters_in_leagues');
  }

  @action
  validateSessionSuccess() {
    this.notificationStore.createNotification({
      title: 'action.success.title.validate_session',
      description: 'action.success.desc.validate_session'
    });
    const activeStep = this.uiStateStore.loginStepper.activeStep;
    this.uiStateStore.loginStepper.setActiveStep(activeStep + 1);
    this.uiStateStore.loginStepper.setSubmitting(false);
  }

  @action
  validateSessionFail(error: Error | string) {
    this.notificationStore.createNotification({
      title: 'action.fail.title.validate_session',
      description: 'action.fail.desc.validate_session'
    });
    this.uiStateStore.loginStepper.setSubmitting(false);
  
    console.error(error);
  }
}

import { action, computed, observable, runInAction, reaction } from 'mobx';
import { persist } from 'mobx-persist';
import { fromStream } from 'mobx-utils';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { IAccount } from '../interfaces/account.interface';
import { externalService } from '../services/external.service';
import { Account } from './domains/account';
import { UiStateStore } from './uiStateStore';
import { switchMap } from 'rxjs/operators';
import { NotificationStore } from './notificationStore';

export class AccountStore {
  constructor(
    private uiStateStore: UiStateStore,
    private notificationStore: NotificationStore
  ) {}

  @persist('list', Account) @observable accounts: Account[] = [];

  @computed
  get getSelectedAccount(): Account {
    const account = this.accounts.find(a => a.selected);
    return account ? account : this.accounts[0];
  }

  @action
  selectAccountByName(name: string) {
    this.resetAccountSelection();
    const account = this.findAccountByName(name);
    account!.setSelected();
  }

  @action
  findAccountByName(name: string) {
    return this.accounts.find(a => a.name === name);
  }

  @action
  resetAccountSelection() {
    this.accounts = this.accounts.map(a => {
      a.selected = false;
      return a;
    });
  }

  @action
  addAccount(details: IAccount) {
    let acc = this.findAccountByName(details.name);
    acc !== undefined
      ? acc.setSessionId(details.sessionId)
      : this.accounts.push(new Account(details));
  }

  @action
  initSession(details?: IAccount) {
    this.uiStateStore.loginStepper.setSubmitting(true);

    if (details !== undefined) {
      this.addAccount(details);
      this.selectAccountByName(details.name);
    }

    const acc = this.getSelectedAccount;

    fromStream(
      forkJoin(
        externalService.getLeagues(),
        externalService.getCharacters(acc!.name)
      ).pipe(
        map(requests => {
          if (requests[0].data.length === 0) {
            throw new Error('error.no_leagues');
          }
          if (requests[1].data.length === 0) {
            throw new Error('error.no_characters');
          }
          acc!.setLeagues(requests[0].data);
          acc!.addCharactersToLeagues(requests[1].data);
        }),
        switchMap(() => {
          return this.uiStateStore.setSessIdCookie(acc!.sessionId);
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

    leagueWithChar !== undefined
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
    this.uiStateStore.loginStepper.setSubmitting(false);
    const activeStep = this.uiStateStore.loginStepper.activeStep;
    this.uiStateStore.loginStepper.setActiveStep(activeStep + 1);
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

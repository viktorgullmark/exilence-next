import { action, computed, observable, runInAction } from 'mobx';
import { persist } from 'mobx-persist';
import { fromStream } from 'mobx-utils';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { IAccount } from '../interfaces/account.interface';
import { externalService } from '../services/external.service';
import { Account } from './types/account';
import { UiStateStore } from './uiStateStore';

export class AccountStore {
  uiStateStore: UiStateStore;
  constructor(uiStateStore: UiStateStore) {
    this.uiStateStore = uiStateStore;
  }

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
          this.uiStateStore.setSessIdCookie(acc!.sessionId);
          this.initSessionSuccess();
        }),
        catchError((e: Error) => {
          return of(this.initSessionFail(e));
        })
      )
    );
  }

  @action
  initSessionSuccess() {
    // todo: create notification
    this.validateSession();
  }

  @action
  initSessionFail(error: Error | string) {
    // todo: create notification
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
    // todo: create notification
  }

  @action
  validateSessionFail(error: Error | string) {
    // todo: create notification
    console.error(error);
  }
}

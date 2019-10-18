import { action, observable } from 'mobx';
import { persist } from 'mobx-persist';

import { IAccount } from '../interfaces/account.interface';
import { Account } from './types/account';

export class AccountStore {
  @persist('list', Account) @observable accounts: Account[] = [];

  @action
  initSession(details: IAccount) {
    this.accounts.push(new Account(details));
    this.initSessionSuccess();
  }

  @action.bound
  initSessionSuccess() {
    this.accounts[0].addLeague({ id: 'testleague', description: 'beepboop' });
  }

  @action.bound
  initSessionError(error: string) {
    console.log(error);
  }
}

import { action, makeObservable, observable } from 'mobx';
import { fromStream } from 'mobx-utils';

import { RootStore } from './rootStore';

export class RouteStore {
  @observable redirectedTo: string | undefined = undefined;

  constructor(private rootStore: RootStore) {
    makeObservable(this);
  }

  @action
  redirect(path: string, loginError?: string) {
    if (path === '/login') {
      fromStream(this.rootStore.signalrHub.stopConnection());
    }
    if (this.redirectedTo !== path) {
      if (loginError) {
        this.rootStore.uiStateStore.setLoginError('error:token_expired');
      }
      this.redirectedTo = path;
    }
  }
}

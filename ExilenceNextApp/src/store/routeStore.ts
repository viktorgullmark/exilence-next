import { action, observable } from 'mobx';
import { fromStream } from 'mobx-utils';
import stores from '.';

export class RouteStore {
  @observable redirectedTo: string | undefined = undefined;

  @action
  redirect(path: string) {
    if (path === '/login') {
      fromStream(stores.signalrHub.stopConnection());
    }
    this.redirectedTo = path;
  }
}

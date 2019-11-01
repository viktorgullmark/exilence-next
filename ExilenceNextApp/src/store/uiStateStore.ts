import { action, observable, runInAction } from 'mobx';
import { persist } from 'mobx-persist';
import { map } from 'rxjs/operators';

import { IAccount } from '../interfaces/account.interface';
import { CookieHelper } from './../helpers/cookie.helper';
import { ICookie } from './../interfaces/cookie.interface';
import { authService } from './../services/auth.service';
import { Stepper } from './domains/stepper';

export class UiStateStore {
  @observable loginStepper: Stepper = new Stepper();
  @observable sessIdCookie: ICookie | undefined = undefined;
  @persist('object') @observable accountForm: IAccount = { name: 'test', sessionId: '' }
  @persist @observable sidenavOpen: boolean = true;

  @action
  setSessIdCookie(sessionId: string) {
    const cookie = CookieHelper.constructCookie(sessionId);
    return authService.setAuthCookie(cookie).pipe(
      map(() => {
        return runInAction(() => {
          this.sessIdCookie = cookie;
        });
      })
    );
  }

  @action
  toggleSidenav() {
    this.sidenavOpen = !this.sidenavOpen;
    console.log('TOGLGED', this.sidenavOpen);
  }
}

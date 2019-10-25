import { action, observable, runInAction } from 'mobx';
import { fromStream } from 'mobx-utils';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { CookieHelper } from './../helpers/cookie.helper';
import { ICookie } from './../interfaces/cookie.interface';
import { authService } from './../services/auth.service';
import { Stepper } from './domains/stepper';
import { IAccount } from '../interfaces/account.interface';
import { persist } from 'mobx-persist';

export class UiStateStore {
  @observable loginStepper: Stepper = new Stepper();
  @observable sessIdCookie: ICookie | undefined = undefined;
  @persist @observable accountForm: IAccount = { name: 'test', sessionId: '' }

  constructor() {}

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
}

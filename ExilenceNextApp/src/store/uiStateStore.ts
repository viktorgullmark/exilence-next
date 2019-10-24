import { action, observable, runInAction } from 'mobx';
import { fromStream } from 'mobx-utils';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { authService } from './../services/auth.service';
import { persist } from 'mobx-persist';
import { StepperProps } from '@material-ui/core/Stepper';
import { Stepper } from './types/stepper';
import { CookieHelper } from './../helpers/cookie.helper';
import { ICookie } from './../interfaces/cookie.interface';

export class UiStateStore {
  @observable loginStepper: Stepper = new Stepper();
  @observable sessIdCookie: ICookie | undefined = undefined;

  constructor() {}

  @action
  setSessIdCookie(sessionId: string) {
    const cookie = CookieHelper.constructCookie(sessionId);
    fromStream(
      authService.setAuthCookie(cookie).pipe(
        map(() => {
          return runInAction(() => {
            this.sessIdCookie = cookie;
          })
        }),
        catchError(error => {
          return of(console.error(error));
        })
      )
    );
  }
}

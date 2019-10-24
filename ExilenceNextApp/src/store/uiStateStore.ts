import { action } from 'mobx';
import { fromStream } from 'mobx-utils';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { authService } from './../services/auth.service';

export class UiStateStore {
  constructor() {}

  @action
  setSessIdCookie(sessionId: string) {
    fromStream(
      authService.setAuthCookie(sessionId).pipe(
        catchError(error => {
          return of(console.error(error));
        })
      )
    );
  }
}

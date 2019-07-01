import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';
import { ApplicationSession } from '../../shared/interfaces/application-session.interface';
import { Store } from '@ngrx/store';
import * as applicationReducer from '../../store/application/application.reducer';
import * as applicationActions from '../../store/application/application.actions';
import { ApplicationEffects } from '../../store/application/application.effects';
import { catchError, first } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';

@Injectable()
export class SessionResolver implements Resolve<any> {
  constructor(
    private router: Router,
    private appStore: Store<ApplicationSession>,
    private applicationEffects: ApplicationEffects,
    private actions$: Actions
  ) { }

  resolve(route: ActivatedRouteSnapshot) {
    if (route.params.validated !== 'true') {
      this.appStore.select(applicationReducer.selectApplicationSession).pipe(first()).subscribe((res: ApplicationSession) => {
        if (res.sessionId !== undefined) {
          this.appStore.dispatch(new applicationActions.InitSession({ accountDetails: res }));

          this.applicationEffects.validateSessionSuccess$
            .subscribe(() => {
              return;
            });

          this.actions$.pipe(ofType(
            applicationActions.ApplicationActionTypes.InitSessionFail,
            applicationActions.ApplicationActionTypes.ValidateSessionFail))
            .subscribe(() => {
              this.router.navigate(['/login']);
              return EMPTY;
            });
        } else {
          this.router.navigate(['/login']);
        }
      });
    }
  }
}

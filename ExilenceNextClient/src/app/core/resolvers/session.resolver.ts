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
import { selectApplicationSession } from '../../store/application/application.selectors';

@Injectable()
export class SessionResolver implements Resolve<any> {
  constructor(
    private router: Router,
    private appStore: Store<ApplicationSession>,
    private applicationEffects: ApplicationEffects,
    private actions$: Actions
  ) { }

  resolve(route: ActivatedRouteSnapshot) {
    console.log(route.params.validated);
    if (route.params.validated !== 'true') {
      this.appStore.select(selectApplicationSession).pipe(first()).subscribe((res: ApplicationSession) => {
        if (res.sessionId !== undefined) {
          this.appStore.dispatch(new applicationActions.InitSession({ accountDetails: res }));
          this.appStore.dispatch(new applicationActions.SetLeague({
            league: res.league
          }));
          this.appStore.dispatch(new applicationActions.SetTradeLeague({
            tradeLeague: res.tradeLeague
          }));

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

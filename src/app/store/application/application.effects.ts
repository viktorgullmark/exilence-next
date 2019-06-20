import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, forkJoin } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import * as applicationActions from './application.actions';
import { ExternalService } from '../../core/providers/external.service';
import { ApplicationSessionDetails } from '../../shared/interfaces/application-session-details.interface';

@Injectable()
export class ApplicationEffects {

  constructor(
    private actions$: Actions,
    private externalService: ExternalService
  ) { }

  initSession$ = createEffect(() => this.actions$.pipe(
    ofType(applicationActions.ApplicationActionTypes.InitSession),
    mergeMap((res: any) => forkJoin(
      of(['league1', 'league2']), // todo: fetch real leagues
      of(['char1', 'char2']) // todo: fetch real chars
    ).pipe(
      map((x) => {
        return new applicationActions.InitSessionSuccess({ accountDetails: res.payload.accountDetails, leagues: x[0], characters: x[1] })
      })
    ))),
  );

  initSessionSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(applicationActions.ApplicationActionTypes.InitSessionSuccess),
    mergeMap((res: any) =>
      of(['league1']) // todo: map real leagues
        .pipe(
          map((x) => {
            console.log(res.payload.accountDetails);
            console.log(x);
            return new applicationActions.ValidateSession({ accountDetails: res.payload.accountDetails, leagues: x })
          })
        ))
  )
  );

  // todo: do validate session
  // set cookie
  // if failed, remove cookie
}



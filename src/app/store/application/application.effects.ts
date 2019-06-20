import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as applicationActions from './application.actions';
import { ExternalService } from '../../core/providers/external.service';
import { ApplicationSessionDetails } from '../../shared/interfaces/application-session-details.interface';

@Injectable()
export class ApplicationEffects {

  constructor(
    private actions$: Actions,
    private externalService: ExternalService
  ) { }

  // todo: finish effect
  validateSession$ = createEffect(() => this.actions$.pipe(
    ofType(applicationActions.ApplicationActionTypes.ValidateSession),
    mergeMap((accountDetails: ApplicationSessionDetails) => of() 
      .pipe(
        map(result => new applicationActions.ValidateSessionSuccess({  })),
        catchError((e) => of(new applicationActions.ValidateSessionFail({ error: e})))
      ))
    )
  );
}

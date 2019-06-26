import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, forkJoin, throwError } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import * as applicationActions from './application.actions';
import * as notificationActions from './../notification/notification.actions';
import { ExternalService } from '../../core/providers/external.service';
import { ApplicationSessionDetails } from '../../shared/interfaces/application-session-details.interface';
import { CookieService } from '../../core/providers/cookie.service';
import { NotificationType } from '../../shared/enums/notification-type.enum';
import { Notification } from './../../shared/interfaces/notification.interface';
@Injectable()
export class ApplicationEffects {

  constructor(
    private actions$: Actions,
    private externalService: ExternalService,
    private cookieService: CookieService
  ) { }

  initSession$ = createEffect(() => this.actions$.pipe(
    ofType(applicationActions.ApplicationActionTypes.InitSession),
    mergeMap((res: any) => forkJoin(
      this.externalService.getLeagues(),
      this.externalService.getCharacters(res.payload.accountDetails.accountName)
    ).pipe(
      map(requests => new applicationActions.InitSessionSuccess({ accountDetails: res.payload.accountDetails, leagues: requests[0], characters: requests[1] }))
    ))),
  );

  initSessionSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(applicationActions.ApplicationActionTypes.InitSessionSuccess),
    mergeMap((res: any) =>
      of(['Standard']) // todo: map real leagues
        .pipe(
          map(leagues => new applicationActions.SetTrialCookie({ accountDetails: res.payload.accountDetails, league: leagues[0] }))
        ))
  )
  );

  validateSession$ = createEffect(() => this.actions$.pipe(
    ofType(applicationActions.ApplicationActionTypes.ValidateSession),
    mergeMap((res: any) =>
      this.externalService.getStashTabs(res.payload.accountDetails.account, res.payload.league)
        .pipe(
          map(() => new applicationActions.ValidateSessionSuccess()),
          catchError(() => of(new applicationActions.ValidateSessionFail({ title: 'ERROR.SESSION_NOT_VALID_TITLE', message: 'ERROR.SESSION_NOT_VALID_DESC' })))
        ))),
  );

  validateSessionFail$ = createEffect(() => this.actions$.pipe(
    ofType(applicationActions.ApplicationActionTypes.ValidateSessionFail),
    map((res: any) => new notificationActions.AddNotification({
      notification:
        {
          title: res.payload.title,
          description: res.payload.message,
          type: NotificationType.Error
        } as Notification
    }))
  )
  );

  validateSessionSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(applicationActions.ApplicationActionTypes.ValidateSessionSuccess),
    map(() => new notificationActions.AddNotification({
      notification:
        {
          title: 'SUCCESS.SESSION_VALID_TITLE',
          description: 'SUCCESS.SESSION_VALID_DESC',
          type: NotificationType.Information
        } as Notification
    }))
  )
  );


  setTrialCookie$ = createEffect(() => this.actions$.pipe(
    ofType(applicationActions.ApplicationActionTypes.SetTrialCookie),
    mergeMap((res: any) =>
      of(this.cookieService.setSessionCookie(res.payload.accountDetails.sessionId))
        .pipe(
          map(() => new applicationActions.ValidateSession({ accountDetails: res.payload.accountDetails, league: res.payload.league }))
        ))),
  );
}



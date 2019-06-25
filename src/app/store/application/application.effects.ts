import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, forkJoin } from 'rxjs';
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
      of(['league1', 'league2']), // todo: fetch real leagues
      of(['char1', 'char2']) // todo: fetch real chars
    ).pipe(
      map((requests) => {
        return new applicationActions.InitSessionSuccess({ accountDetails: res.payload.accountDetails, leagues: requests[0], characters: requests[1] })
      })
    ))),
  );

  initSessionSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(applicationActions.ApplicationActionTypes.InitSessionSuccess),
    mergeMap((res: any) =>
      of(['league1']) // todo: map real leagues
        .pipe(
          map((x) => {
            return new applicationActions.ValidateSession({ accountDetails: res.payload.accountDetails, leagues: x })
          })
        ))
  )
  );

  validateSession$ = createEffect(() => this.actions$.pipe(
    ofType(applicationActions.ApplicationActionTypes.ValidateSession),
    mergeMap((res: any) =>
      of(false) // validate session and return true/false
        .pipe(
          map((validated) => {
            if (validated) {
              return new applicationActions.SetCookie({ sessionId: res.payload.accountDetails.sessionId });
            } else {
              return new applicationActions.ValidateSessionFail({ title: 'ERROR.SESSION_NOT_VALID_TITLE', message: 'ERROR.SESSION_NOT_VALID_DESC' });
            }
          })
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

  setCookie$ = createEffect(() => this.actions$.pipe(
    ofType(applicationActions.ApplicationActionTypes.SetCookie),
    mergeMap((sessionId: any) =>
      of(this.cookieService.setSessionCookie(sessionId))
        .pipe(
          map((x) => {
            return new applicationActions.ValidateSessionSuccess()
          })
        ))),
  );
}



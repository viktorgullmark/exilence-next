import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { forkJoin, of, EMPTY } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { CookieService } from '../../core/providers/cookie.service';
import { ExternalService } from '../../core/providers/external.service';
import { NotificationType } from '../../shared/enums/notification-type.enum';
import { AccountHelper } from '../../shared/helpers/account.helper';
import { League } from '../../shared/interfaces/league.interface';
import { Notification } from './../../shared/interfaces/notification.interface';
import * as notificationActions from './../notification/notification.actions';
import * as applicationActions from './application.actions';
import { Store } from '@ngrx/store';
import { ApplicationSession } from '../../shared/interfaces/application-session.interface';
import { Stash } from '../../shared/interfaces/stash.interface';
import { StorageMap } from '@ngx-pwa/local-storage';
import { ApplicationState } from '../../app.states';

@Injectable()
export class ApplicationEffects {

  constructor(
    private actions$: Actions,
    private externalService: ExternalService,
    private cookieService: CookieService,
    private appStore: Store<ApplicationSession>,
    private storageMap: StorageMap
  ) { }

  initSession$ = createEffect(() => this.actions$.pipe(
    ofType(applicationActions.ApplicationActionTypes.InitSession),
    mergeMap((res: any) => forkJoin(
      this.externalService.getLeagues().pipe(map((leagues: League[]) => leagues.map(league => league.id))),
      this.externalService.getCharacters(res.payload.accountDetails.account),
    ).pipe(
      map(requests => {
        this.storageMap.set('session.accountDetails', res.payload.accountDetails).subscribe();
        if (requests[0].length === 0) {
          return new applicationActions.InitSessionFail({ title: 'ERROR.NO_LEAGUES_TITLE', message: 'ERROR.NO_LEAGUES_DESC' });
        } else if (requests[1].length === 0) {
          return new applicationActions.InitSessionFail({ title: 'ERROR.NO_CHARS_TITLE', message: 'ERROR.NO_CHARS_DESC' });
        } else {
          this.appStore.dispatch(new applicationActions.AddLeagues({ leagues: requests[0] }));
          this.appStore.dispatch(new applicationActions.AddCharacters({ characters: requests[1] }));
          return new applicationActions.InitSessionSuccess(
            { accountDetails: res.payload.accountDetails, leagues: requests[0], characters: requests[1] });
        }
      }),
      catchError(() => of(
        new applicationActions.InitSessionFail(
          { title: 'ERROR.INIT_SESSION_FAIL_TITLE', message: 'ERROR.INIT_SESSION_FAIL_DESC' })))
    ))),
  );

  initSessionFail$ = createEffect(() => this.actions$.pipe(
    ofType(applicationActions.ApplicationActionTypes.InitSessionFail),
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


  initSessionSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(applicationActions.ApplicationActionTypes.InitSessionSuccess),
    mergeMap((res: any) =>
      of(AccountHelper.GetLeagues(res.payload.characters))
        .pipe(
          map(leagues => {
            this.storageMap.set('session.leagues', res.payload.leagues).subscribe();
            this.storageMap.set('session.characters', res.payload.characters).subscribe();
            this.storageMap.set('session.characterLeagues', leagues).subscribe();
            return new applicationActions.SetTrialCookie(
              { accountDetails: res.payload.accountDetails, league: leagues[0] });
          })
        ))
  )
  );

  validateSession$ = createEffect(() => this.actions$.pipe(
    ofType(applicationActions.ApplicationActionTypes.ValidateSession),
    mergeMap((res: any) =>
      this.externalService.getStashTabs(res.payload.accountDetails.account, res.payload.league)
        .pipe(
          map(() => {
            return new applicationActions.ValidateSessionSuccess({ accountDetails: res.payload.accountDetails });
          }),
          catchError(() => of(
            new applicationActions.ValidateSessionFail(
              { title: 'ERROR.SESSION_NOT_VALID_TITLE', message: 'ERROR.SESSION_NOT_VALID_DESC' })))
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



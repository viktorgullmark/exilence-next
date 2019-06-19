import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { TabSnapshotsState } from '../../../app.states';
import { NotificationType } from '../../../shared/enums/notification-type.enum';
import { Application } from '../../../shared/interfaces/application.interface';
import { NotificationsState } from './../../../app.states';
import { Notification } from './../../../shared/interfaces/notification.interface';
import * as applicationActions from './../../../store/application/application.actions';
import * as appReducer from './../../../store/application/application.reducer';
import * as notificationActions from './../../../store/notification/notification.actions';

@Injectable()
export class SnapshotService {

  private appState$: Observable<Application>;

  constructor(
    private translateService: TranslateService,
    private tabSnapshotStore: Store<TabSnapshotsState>,
    private appStore: Store<Application>,
    private notificationStore: Store<NotificationsState>
  ) {

    this.appState$ = this.appStore.select(appReducer.selectApplication);

    this.checkIfReady();
  }

  snapshot() {
    this.setSnapshotStatus(true);

    this.translateService.get([
      'SNAPSHOT.SNAPSHOT_STARTED_TITLE',
      'SNAPSHOT.SNAPSHOT_STARTED_DESC'
    ]).subscribe(translations => {
      this.notificationStore.dispatch(new notificationActions.AddNotification({
        notification: {
          title: translations['SNAPSHOT.SNAPSHOT_STARTED_TITLE'],
          description: translations['SNAPSHOT.SNAPSHOT_STARTED_DESC'],
          type: NotificationType.Information
        } as Notification
      }));
    });

    // todo: fetch current session and retrieve stashtabs

    setTimeout(() => {
      // temporary timeout to spoof snapshot
      this.setSnapshotStatus(false);

      this.translateService.get([
        'SNAPSHOT.SNAPSHOT_FINISHED_TITLE',
        'SNAPSHOT.SNAPSHOT_FINISHED_DESC'
      ]).subscribe(translations => {
        this.notificationStore.dispatch(new notificationActions.AddNotification({
          notification: {
            title: translations['SNAPSHOT.SNAPSHOT_FINISHED_TITLE'],
            description: translations['SNAPSHOT.SNAPSHOT_FINISHED_DESC'],
            type: NotificationType.Information
          } as Notification
        }));
      });

    }, 5 * 1000);
  }

  setSnapshotStatus(running: boolean) {
    this.appStore.dispatch(new applicationActions.UpdateSnapshotStatus({
      running: running
    }));
  }

  checkIfReady() {
    // check if ready to begin snapshotting
    setInterval(() => {
      this.appState$.subscribe((res: Application) => {
        if (!res.snapshotting) {
          this.snapshot();
        }
      });
    }, 1000 * 1);
  }
}

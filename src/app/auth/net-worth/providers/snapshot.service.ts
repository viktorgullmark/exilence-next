import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { NotificationType } from '../../../shared/enums/notification-type.enum';
import { NetWorthStatus } from '../../../shared/interfaces/net-worth-status.interface';
import { NotificationsState, NetWorthState } from './../../../app.states';
import { Notification } from './../../../shared/interfaces/notification.interface';
import * as netWorthActions from './../../../store/net-worth/net-worth.actions';
import * as netWorthReducer from './../../../store/net-worth/net-worth.reducer';
import * as notificationActions from './../../../store/notification/notification.actions';

@Injectable()
export class SnapshotService {

  private netWorthStatus$: Observable<NetWorthStatus>;

  constructor(
    private translateService: TranslateService,
    private netWorthStore: Store<NetWorthState>,
    private notificationStore: Store<NotificationsState>
  ) {

    this.netWorthStatus$ = this.netWorthStore.select(netWorthReducer.selectNetWorthStatus);

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
    // todo: set snapshotting = true
  }

  checkIfReady() {
    // check if ready to begin snapshotting
    setInterval(() => {
      this.netWorthStatus$.subscribe((res: NetWorthStatus) => {
        if (!res.snapshotting) {
          this.snapshot();
        }
      });
    }, 1000 * 10);
  }
}

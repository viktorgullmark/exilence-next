import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { NotificationsState } from '../../../app.states';
import { Notification } from './../../../shared/interfaces/notification.interface';
import * as notificationReducer from './../../../store/notification/notification.reducer';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent implements OnInit {
  public allNotifications$: Observable<Notification[]>;
  public allNewNotifications$: Observable<Notification[]>;

  constructor(
    private notificationStore: Store<NotificationsState>
  ) {
    this.allNotifications$ = this.notificationStore.select(notificationReducer.selectAllNotifications);
    this.allNewNotifications$ = this.notificationStore.select(notificationReducer.selectAllNotifications);
  }

  ngOnInit() {
  }
}

import { Component, OnInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { NotificationsState } from '../../../app.states';
import { Notification } from './../../../shared/interfaces/notification.interface';
import * as notificationReducer from './../../../store/notification/notification.reducer';
import { NotificationService } from '../../providers/notification.service';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent implements OnInit {
  public allNotifications$: Observable<Notification[]>;

  constructor(
    private notificationStore: Store<NotificationsState>,
    private notificationService: NotificationService
  ) {
      this.allNotifications$ = this.notificationStore.select(notificationReducer.selectAllNotifications);
  }

  ngOnInit() {
  }
}

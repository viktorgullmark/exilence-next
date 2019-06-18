import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Guid } from 'guid-typescript';

import { NotificationType } from '../../shared/enums/notification-type.enum';
import { NotificationsState } from './../../app.states';
import { Notification } from './../../shared/interfaces/notification.interface';
import * as notificationActions from './../../store/notification/notification.actions';

@Injectable()
export class NotificationService {

    constructor(private notificationStore: Store<NotificationsState>) {
    }

    addNotification() {
        this.notificationStore.dispatch(new notificationActions.AddNotification({
            notification: {
                id: Guid.create(), type: NotificationType.Information, title: 'test notification', description: 'no description'
            } as Notification
        }));
    }
}

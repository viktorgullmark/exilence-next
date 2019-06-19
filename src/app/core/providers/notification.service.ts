import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { NotificationsState } from './../../app.states';
import { Notification } from './../../shared/interfaces/notification.interface';
import * as notificationActions from './../../store/notification/notification.actions';
import { NotificationType } from '../../shared/enums/notification-type.enum';
import { Guid } from 'guid-typescript';

@Injectable()
export class NotificationService {

    constructor(private notificationStore: Store<NotificationsState>) {
    }

    addNotification(title: string, desc: string, type: NotificationType) {
        this.notificationStore.dispatch(new notificationActions.AddNotification({
            notification: { id: Guid.create(), title: title, description: desc, type: type }
        }));
    }
}

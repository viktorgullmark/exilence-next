import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as moment from 'moment';
import * as fromAdapter from './notification.adapter';
import { NotificationActions, NotificationActionTypes } from './notification.actions';
import { NotificationsState } from '../../app.states';
import { Notification } from './../../shared/interfaces/notification.interface';
import { Guid } from 'guid-typescript';
import { NotificationType } from '../../shared/enums/notification-type.enum';
import { initialState } from './notification.state';


export function reducer(
  state = initialState,
  action: NotificationActions
): NotificationsState {
  switch (action.type) {
    case NotificationActionTypes.AddNotification: {
      const notification = { id: Guid.create().toString(), timestamp: moment(), read: false };
      const merged = { ...action.payload.notification, ...notification };
      return fromAdapter.adapter.addOne(merged, state);
    }

    case NotificationActionTypes.DeleteNotification: {
      return fromAdapter.adapter.removeOne(action.payload.id, state);
    }

    case NotificationActionTypes.LoadNotifications: {
      return fromAdapter.adapter.addAll(action.payload.notifications, state);
    }

    case NotificationActionTypes.MarkManyAsRead: {
      return fromAdapter.adapter.updateMany(action.payload.notifications, state);
    }

    default: {
      return state;
    }
  }
}

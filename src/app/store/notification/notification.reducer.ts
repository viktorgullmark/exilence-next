import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';

import { Notification } from '../../shared/interfaces/notification.interface';
import * as fromAdapter from './notfication.adapter';
import { NotificationActions, NotificationActionTypes } from './notification.actions';

export interface NotificationsState extends EntityState<Notification> {
  // additional entities state properties
}

export const adapter: EntityAdapter<Notification> = createEntityAdapter<Notification>();

export const initialState: NotificationsState = adapter.getInitialState({
  ids: [],
  entities: {}
});

export function reducer(
  state = initialState,
  action: NotificationActions
): NotificationsState {
  switch (action.type) {
    case NotificationActionTypes.AddNotification: {
      return adapter.addOne(action.payload.notification, state);
    }

    case NotificationActionTypes.UpsertNotification: {
      return adapter.upsertOne(action.payload.notification, state);
    }

    case NotificationActionTypes.AddNotifications: {
      return adapter.addMany(action.payload.notifications, state);
    }

    case NotificationActionTypes.UpsertNotifications: {
      return adapter.upsertMany(action.payload.notifications, state);
    }

    case NotificationActionTypes.UpdateNotification: {
      return adapter.updateOne(action.payload.notification, state);
    }

    case NotificationActionTypes.UpdateNotifications: {
      return adapter.updateMany(action.payload.notifications, state);
    }

    case NotificationActionTypes.DeleteNotification: {
      return adapter.removeOne(action.payload.id, state);
    }

    case NotificationActionTypes.DeleteNotifications: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case NotificationActionTypes.LoadNotifications: {
      return adapter.addAll(action.payload.notifications, state);
    }

    case NotificationActionTypes.ClearNotifications: {
      return adapter.removeAll(state);
    }

    default: {
      return state;
    }
  }
}

export const getNotificationsState = createFeatureSelector<NotificationsState>('notificationsState');
export const selectAllNotifications = createSelector(getNotificationsState, fromAdapter.selectAllNotifications);

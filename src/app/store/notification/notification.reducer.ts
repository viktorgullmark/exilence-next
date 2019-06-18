import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromAdapter from './notfication.adapter';
import { NotificationActions, NotificationActionTypes } from './notification.actions';
import { NotificationsState } from '../../app.states';

export const initialState: NotificationsState = fromAdapter.adapter.getInitialState({
  ids: [],
  entities: {}
});

export function reducer(
  state = initialState,
  action: NotificationActions
): NotificationsState {
  switch (action.type) {
    case NotificationActionTypes.AddNotification: {
      return fromAdapter.adapter.addOne(action.payload.notification, state);
    }

    case NotificationActionTypes.UpsertNotification: {
      return fromAdapter.adapter.upsertOne(action.payload.notification, state);
    }

    case NotificationActionTypes.AddNotifications: {
      return fromAdapter.adapter.addMany(action.payload.notifications, state);
    }

    case NotificationActionTypes.UpsertNotifications: {
      return fromAdapter.adapter.upsertMany(action.payload.notifications, state);
    }

    case NotificationActionTypes.UpdateNotification: {
      return fromAdapter.adapter.updateOne(action.payload.notification, state);
    }

    case NotificationActionTypes.UpdateNotifications: {
      return fromAdapter.adapter.updateMany(action.payload.notifications, state);
    }

    case NotificationActionTypes.DeleteNotification: {
      return fromAdapter.adapter.removeOne(action.payload.id, state);
    }

    case NotificationActionTypes.DeleteNotifications: {
      return fromAdapter.adapter.removeMany(action.payload.ids, state);
    }

    case NotificationActionTypes.LoadNotifications: {
      return fromAdapter.adapter.addAll(action.payload.notifications, state);
    }

    case NotificationActionTypes.ClearNotifications: {
      return fromAdapter.adapter.removeAll(state);
    }

    default: {
      return state;
    }
  }
}

export const getNotificationsState = createFeatureSelector<NotificationsState>('notificationsState');
export const selectAllNotifications = createSelector(getNotificationsState, fromAdapter.selectAllNotifications);

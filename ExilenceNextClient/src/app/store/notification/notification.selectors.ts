import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromAdapter from './notification.adapter';
import { Notification } from './../../shared/interfaces/notification.interface';
import { NotificationType } from '../../shared/enums/notification-type.enum';
import { NotificationsState } from '../../app.states';

export const getNotificationsState = createFeatureSelector<NotificationsState>('notificationsState');
export const selectAllNotifications = createSelector(getNotificationsState, fromAdapter.selectAllNotifications);

export const selectAllNewErrorNotifications = createSelector(
    selectAllNotifications,
    (notifications: Notification[]) => notifications.filter(n => !n.read && n.type === NotificationType.Error)
);


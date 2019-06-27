import { Action } from '@ngrx/store';

import { Notification } from '../../shared/interfaces/notification.interface';
import { Update } from '@ngrx/entity';

export enum NotificationActionTypes {
  LoadNotifications = '[Notification] Load Notifications',
  AddNotification = '[Notification] Add Notification',
  DeleteNotification = '[Notification] Delete Notification',
  MarkManyAsRead = '[Notification] Mark many as read'
}

export class LoadNotifications implements Action {
  readonly type = NotificationActionTypes.LoadNotifications;

  constructor(public payload: { notifications: Notification[] }) {}
}

export class AddNotification implements Action {
  readonly type = NotificationActionTypes.AddNotification;

  constructor(public payload: { notification: Notification }) {}
}

export class DeleteNotification implements Action {
  readonly type = NotificationActionTypes.DeleteNotification;

  constructor(public payload: { id: string }) {}
}

export class MarkManyAsRead implements Action {
  readonly type = NotificationActionTypes.MarkManyAsRead;

  constructor(public payload: { notifications: Update<Notification>[] }) {}
}

export type NotificationActions =
 LoadNotifications
 | AddNotification
 | DeleteNotification
 | MarkManyAsRead;

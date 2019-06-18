import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { Notification } from '../../shared/interfaces/notification.interface';

export enum NotificationActionTypes {
  LoadNotifications = '[Notification] Load Notifications',
  AddNotification = '[Notification] Add Notification',
  AddNotifications = '[Notification] Add Notifications',
  DeleteNotification = '[Notification] Delete Notification',
  ClearNotifications = '[Notification] Clear Notifications'
}

export class LoadNotifications implements Action {
  readonly type = NotificationActionTypes.LoadNotifications;

  constructor(public payload: { notifications: Notification[] }) {}
}

export class AddNotification implements Action {
  readonly type = NotificationActionTypes.AddNotification;

  constructor(public payload: { notification: Notification }) {}
}

export class AddNotifications implements Action {
  readonly type = NotificationActionTypes.AddNotifications;

  constructor(public payload: { notifications: Notification[] }) {}
}

export class DeleteNotification implements Action {
  readonly type = NotificationActionTypes.DeleteNotification;

  constructor(public payload: { id: string }) {}
}

export class ClearNotifications implements Action {
  readonly type = NotificationActionTypes.ClearNotifications;
}

export type NotificationActions =
 LoadNotifications
 | AddNotification
 | AddNotifications
 | DeleteNotification
 | ClearNotifications;

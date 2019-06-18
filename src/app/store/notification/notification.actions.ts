import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { Notification } from '../../shared/interfaces/notification.interface';

export enum NotificationActionTypes {
  LoadNotifications = '[Notification] Load Notifications',
  AddNotification = '[Notification] Add Notification',
  UpsertNotification = '[Notification] Upsert Notification',
  AddNotifications = '[Notification] Add Notifications',
  UpsertNotifications = '[Notification] Upsert Notifications',
  UpdateNotification = '[Notification] Update Notification',
  UpdateNotifications = '[Notification] Update Notifications',
  DeleteNotification = '[Notification] Delete Notification',
  DeleteNotifications = '[Notification] Delete Notifications',
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

export class UpsertNotification implements Action {
  readonly type = NotificationActionTypes.UpsertNotification;

  constructor(public payload: { notification: Notification }) {}
}

export class AddNotifications implements Action {
  readonly type = NotificationActionTypes.AddNotifications;

  constructor(public payload: { notifications: Notification[] }) {}
}

export class UpsertNotifications implements Action {
  readonly type = NotificationActionTypes.UpsertNotifications;

  constructor(public payload: { notifications: Notification[] }) {}
}

export class UpdateNotification implements Action {
  readonly type = NotificationActionTypes.UpdateNotification;

  constructor(public payload: { notification: Update<Notification> }) {}
}

export class UpdateNotifications implements Action {
  readonly type = NotificationActionTypes.UpdateNotifications;

  constructor(public payload: { notifications: Update<Notification>[] }) {}
}

export class DeleteNotification implements Action {
  readonly type = NotificationActionTypes.DeleteNotification;

  constructor(public payload: { id: string }) {}
}

export class DeleteNotifications implements Action {
  readonly type = NotificationActionTypes.DeleteNotifications;

  constructor(public payload: { ids: string[] }) {}
}

export class ClearNotifications implements Action {
  readonly type = NotificationActionTypes.ClearNotifications;
}

export type NotificationActions =
 LoadNotifications
 | AddNotification
 | UpsertNotification
 | AddNotifications
 | UpsertNotifications
 | UpdateNotification
 | UpdateNotifications
 | DeleteNotification
 | DeleteNotifications
 | ClearNotifications;

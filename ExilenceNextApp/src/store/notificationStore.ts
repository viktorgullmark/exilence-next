import { observable, action } from 'mobx';
import { Notification } from './domains/notification';
import { INotification } from './../interfaces/notification.interface';
import { UiStateStore } from './uiStateStore';

export class NotificationStore {
  uiStateStore: UiStateStore;
  @observable notifications: Notification[] = [];

  constructor(uiStateStore: UiStateStore) {
    this.uiStateStore = uiStateStore;
  }

  @action
  createNotification(n: INotification) {
    const notification = new Notification(n);
    this.notifications.push(notification);
    return notification;
  }

  @action
  markAsRead(uuid: string) {
    const notification = this.notifications.find(n => n.uuid === uuid);
    notification!.read = true;
    return notification;
  }
}

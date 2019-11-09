import { observable, action } from 'mobx';
import { Notification } from './domains/notification';
import { INotification } from './../interfaces/notification.interface';
import { UiStateStore } from './uiStateStore';
import { NotificationType } from '../enums/notification-type.enum';

export class NotificationStore {
  uiStateStore: UiStateStore;
  @observable notifications: Notification[] = [];

  constructor(uiStateStore: UiStateStore) {
    this.uiStateStore = uiStateStore;
  }

  @action
  createNotification(n: INotification) {
    const prefix = `notification:${NotificationType[n.type].toLowerCase()}.`;
    n.title = `title.${prefix}${n.title}`;
    n.description = `description.${prefix}${n.description}`;
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

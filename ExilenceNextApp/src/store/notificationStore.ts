import { observable, action } from 'mobx';
import { Notification } from './domains/notification';
import { UiStateStore } from './uiStateStore';
import { NotificationType } from '../enums/notification-type.enum';

export class NotificationStore {
  uiStateStore: UiStateStore;
  @observable notifications: Notification[] = [];

  constructor(uiStateStore: UiStateStore) {
    this.uiStateStore = uiStateStore;
  }

  @action
  createNotification(key: string, type: NotificationType, desc?: string) {
    const prefix = `notification:${NotificationType[type].toLowerCase()}.`;
    const title = `${prefix}.title.${key}`;
    const description = `${prefix}.description.${desc ? desc : key}`;
    const notification = new Notification({ title, description, type });
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

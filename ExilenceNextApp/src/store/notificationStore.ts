import { observable, action, computed } from 'mobx';
import { Notification } from './domains/notification';
import { UiStateStore } from './uiStateStore';
import { NotificationType } from '../interfaces/notification.interface';

export class NotificationStore {
  uiStateStore: UiStateStore;
  @observable notifications: Notification[] = [];
  @observable displayed: string[] = [];
  
  constructor(uiStateStore: UiStateStore) {
    this.uiStateStore = uiStateStore;
  }

  @computed
  get alertNotifications() {
    const alerts = this.notifications.filter(n => n.displayAlert);
    return alerts;
  }

  @action
  addDisplayed(uuid: string) {
    this.displayed = [...this.displayed, uuid];
  }

  @action
  createNotification(
    key: string,
    type: NotificationType,
    displayAlert?: boolean,
    desc?: string
  ) {
    const prefix = `notification:${type}`;
    const title = `${prefix}.title.${key}`;
    const description = `${prefix}.description.${desc ? desc : key}`;
    const notification = new Notification({ title, description, type, displayAlert });

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

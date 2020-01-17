import { AxiosError } from 'axios';
import { action, computed, observable } from 'mobx';
import { NotificationType } from '../interfaces/notification.interface';
import { Notification } from './domains/notification';
import { UiStateStore } from './uiStateStore';
import { ErrorUtils } from '../utils/error.utils';

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

  @computed
  get unreadNotifications() {
    const alerts = this.notifications.filter(n => !n.read);
    return alerts;
  }

  @action
  addDisplayed(uuid: string) {
    this.displayed.unshift(uuid);
    this.displayed = this.displayed.slice(0, 10);
  }

  @action
  createNotification(
    key: string,
    type: NotificationType,
    displayAlert?: boolean,
    error?: AxiosError | Error,
    translateParam?: string
  ) {
    const prefix = `notification:${type}`;
    const title = `${prefix}.title.${key}`;
    const description = error
      ? ErrorUtils.translateError(error)
      : `${prefix}.description.${key}`;

    const notification = new Notification({
      title,
      description,
      type,
      displayAlert,
      stackTrace: error ? error.message : undefined,
      translateParam
    });

    this.notifications.unshift(notification);

    this.notifications = this.notifications.slice(0, 10);

    return notification;
  }

  @action
  markAsRead(uuid: string) {
    const notification = this.notifications.find(n => n.uuid === uuid);
    notification!.read = true;
    return notification;
  }

  @action
  markAllAsRead() {
    this.notifications = this.notifications.map(n => {
      n.read = true;
      return n;
    });
  }
}

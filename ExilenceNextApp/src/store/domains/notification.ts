import { observable } from 'mobx';
import moment, { Moment } from 'moment';
import uuid from 'uuid';
import {
  INotification,
  NotificationType
} from './../../interfaces/notification.interface';

export class Notification implements INotification {
  uuid: string = uuid.v4();
  title: string = '';
  timestamp: Moment = moment();
  description: string = '';
  @observable read: boolean = false;
  type: NotificationType = 'info';
  displayAlert?: boolean;
  stackTrace?: string;

  constructor(obj?: INotification) {
    Object.assign(this, obj);
  }
}

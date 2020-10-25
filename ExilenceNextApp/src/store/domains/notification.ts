import { makeObservable, observable } from 'mobx';
import moment, { Moment } from 'moment';
import { v4 as uuidv4 } from 'uuid';

import { INotification, NotificationType } from './../../interfaces/notification.interface';

export class Notification implements INotification {
  uuid: string = uuidv4();
  title: string = '';
  timestamp: Moment = moment();
  description: string = '';
  @observable read: boolean = false;
  type: NotificationType = 'info';
  displayAlert?: boolean;
  stackTrace?: string;
  translateParam?: string;

  constructor(obj?: INotification) {
    makeObservable(this);
    Object.assign(this, obj);
  }
}

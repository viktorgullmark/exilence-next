import { observable } from 'mobx';
import moment, { Moment } from 'moment';
import uuid from 'uuid';
import { NotificationType } from '../../enums/notification-type.enum';
import { INotification } from './../../interfaces/notification.interface';

export class Notification implements INotification {
    uuid: string = uuid.v4();
    @observable title: string = '';
    @observable timestamp: Moment = moment();
    @observable description: string = '';
    @observable read: boolean = false;
    @observable type: NotificationType = 1;

    constructor(obj?: INotification) {
        Object.assign(this, obj);
    }
  }
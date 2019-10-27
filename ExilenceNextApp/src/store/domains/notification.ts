import { observable } from 'mobx';
import moment, { Moment } from 'moment';
import uuid from 'uuid';
import { NotificationType } from '../../enums/notification-type.enum';
import { INotification } from './../../interfaces/notification.interface';

export class Notification implements INotification {
    uuid: string = uuid.v4();
    title: string = '';
    timestamp: Moment = moment();
    description: string = '';
    @observable read: boolean = false;
    type: NotificationType = 1;

    constructor(obj?: INotification) {
        Object.assign(this, obj);
    }
  }
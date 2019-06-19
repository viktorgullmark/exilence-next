import { NotificationType } from '../enums/notification-type.enum';
import { Guid } from 'guid-typescript';
import { Moment } from 'moment';

export interface Notification {
  id: Guid;
  title: string;
  timestamp: Moment;
  description: string;
  type: NotificationType;
}

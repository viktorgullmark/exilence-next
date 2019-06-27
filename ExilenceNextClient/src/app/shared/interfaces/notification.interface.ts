import { NotificationType } from '../enums/notification-type.enum';
import { Moment } from 'moment';

export interface Notification {
  id: string;
  title: string;
  timestamp: Moment;
  description: string;
  read: boolean;
  type: NotificationType;
}

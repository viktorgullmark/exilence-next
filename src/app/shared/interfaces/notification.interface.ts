import { NotificationType } from '../enums/notification-type.enum';
import { Guid } from 'guid-typescript';

export interface Notification {
  id: Guid;
  title: string;
  description: string;
  type: NotificationType;
}

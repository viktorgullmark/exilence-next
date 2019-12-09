import { Moment } from 'moment';

export type NotificationType = 'success' | 'info' | 'error' | 'warning';

export interface INotification {
  title: string;
  timestamp?: Moment;
  description?: string;
  read?: boolean;
  type: NotificationType;
  displayAlert?: boolean;
  stackTrace?: string;
  translateParam?: string;
}

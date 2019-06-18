
import { EntityState } from '@ngrx/entity';
import { Notification } from './shared/interfaces/notification.interface';

export interface AppState {
    notificationsState: NotificationsState;
}

export interface NotificationsState extends EntityState<Notification> { }

import { EntityState } from '@ngrx/entity';
import { Notification } from './shared/interfaces/notification.interface';
import { ApplicationStatus } from './shared/interfaces/application-status.interface';

export interface AppState {
    notificationsState: NotificationsState;
    applicationStatusState: ApplicationStatusState;
}

export interface NotificationsState extends EntityState<Notification> { }

export interface ApplicationStatusState {
    status: ApplicationStatus | null;
}
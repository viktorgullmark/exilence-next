
import { EntityState } from '@ngrx/entity';
import { Notification } from './shared/interfaces/notification.interface';
import { ApplicationStatus } from './shared/interfaces/application-status.interface';
import { TabSnapshot } from './shared/interfaces/tab-snapshot.interface';

export interface AppState {
    notificationsState: NotificationsState;
    tabSnapshotsState: TabSnapshotsState;
    applicationStatusState: ApplicationStatusState;
}

export interface NotificationsState extends EntityState<Notification> { }
export interface TabSnapshotsState extends EntityState<TabSnapshot> { }

export interface ApplicationStatusState {
    status: ApplicationStatus | null;
}
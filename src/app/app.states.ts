
import { EntityState } from '@ngrx/entity';
import { Notification } from './shared/interfaces/notification.interface';
import { Application } from './shared/interfaces/application.interface';
import { TabSnapshot } from './shared/interfaces/tab-snapshot.interface';

export interface AppState {
    notificationsState: NotificationsState;
    tabSnapshotsState: TabSnapshotsState;
    applicationState: ApplicationState;
}

export interface NotificationsState extends EntityState<Notification> { }
export interface TabSnapshotsState extends EntityState<TabSnapshot> { }

export interface ApplicationState {
    status: Application | null;
}

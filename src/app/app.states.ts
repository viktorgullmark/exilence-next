import { EntityState } from '@ngrx/entity';

import { NetWorthSettings } from './shared/interfaces/net-worth-settings.interface';
import { NetWorthStatus } from './shared/interfaces/net-worth-status.interface';
import { Notification } from './shared/interfaces/notification.interface';
import { Session } from './shared/interfaces/session.interface';

export interface AppState {
    notificationsState: NotificationsState;
    applicationState: ApplicationState;
    netWorthState: NetWorthState;
}

export interface NotificationsState extends EntityState<Notification> { }

export interface ApplicationState {
    session: Session | null;
}

export interface NetWorthState {
    status: NetWorthStatus | null;
    settings: NetWorthSettings | null;
}

// export interface State extends AppState {
//     netWorth: NetWorthState;
// }

import { EntityState } from '@ngrx/entity';

import { NetWorthSettings } from './shared/interfaces/net-worth-settings.interface';
import { NetWorthStatus } from './shared/interfaces/net-worth-status.interface';
import { Notification } from './shared/interfaces/notification.interface';
import { ApplicationSession } from './shared/interfaces/application-session.interface';
import { PricedItem } from './shared/interfaces/priced-item.interface';
import { Tab } from './shared/interfaces/stash.interface';
import { NetWorthStash } from './shared/interfaces/net-worth-stash.interface';

export interface AppState {
    notificationsState: NotificationsState;
    applicationState: ApplicationState;
    netWorthState: NetWorthState;
}

export interface NotificationsState extends EntityState<Notification> { }

export interface ApplicationState {
    session: ApplicationSession | null;
}

export interface NetWorthState {
    status: NetWorthStatus | null;
    settings: NetWorthSettings | null;
    stash: NetWorthStash | null;
}

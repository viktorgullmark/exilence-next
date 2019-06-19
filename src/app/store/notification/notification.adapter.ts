import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { Notification } from '../../shared/interfaces/notification.interface';

export const adapter: EntityAdapter<Notification> = createEntityAdapter<Notification>({
    selectId: (notification: Notification) => notification.id.toString(),
});

export const {
    selectAll: selectAllNotifications,
    selectEntities: selectNotificationEntities,
} = adapter.getSelectors();

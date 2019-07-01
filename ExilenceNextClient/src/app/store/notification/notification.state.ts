import { NotificationsState } from '../../app.states';
import * as fromAdapter from './notification.adapter';

export const initialState: NotificationsState = fromAdapter.adapter.getInitialState({
    ids: [],
    entities: {}
});

import { NetWorthState } from '../../app.states';

export const initialState: NetWorthState = {
    status: {
        snapshotting: false,
        lastSnapshot: undefined,
        tabsLoading: false
    },
    settings: {
        selectedTabs: [],
        tabs: []
    },
    items: []
};

import { NetWorthState } from '../../app.states';

export const initialState: NetWorthState = {
    status: {
        snapshotting: false,
        lastSnapshot: undefined
    },
    settings: {
        selectedTabs: []
    },
    stash: {
        tabs: []
    },
    prices: {
        poeNinja: [],
        poeWatch: []
    },
    history: {
        snapshots: []
    }
};

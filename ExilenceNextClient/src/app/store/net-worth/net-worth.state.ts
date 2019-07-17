import { NetWorthState } from '../../app.states';

export const initialState: NetWorthState = {
    status: {
        snapshotting: false,
        lastSnapshot: undefined
    },
    settings: {
        selectedTabs: [],
        automaticSnapshotting: true
    },
    stash: {
        tabs: [],
        tabCountFetched: 0,
        tabCount: 0
    },
    prices: {
        poeNinja: [],
        poeWatch: []
    },
    history: {
        snapshots: []
    }
};

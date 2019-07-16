import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NetWorthState } from '../../app.states';

export const getNetWorthState = createFeatureSelector<NetWorthState>('netWorthState');
export const selectNetWorthStatus = createSelector(getNetWorthState,
    (state: NetWorthState) => state.status
);

export const selectNetWorthSettings = createSelector(getNetWorthState,
    (state: NetWorthState) => state.settings
);

export const selectNetWorthSelectedTabs = createSelector(getNetWorthState,
    (state: NetWorthState) => state.settings.selectedTabs
);

export const selectNetWorthStashTabs = createSelector(getNetWorthState,
    (state: NetWorthState) => state.stash.tabs
);

export const selectNetWorthSnapshots = createSelector(getNetWorthState,
    (state: NetWorthState) => state.history.snapshots
);

export const selectNetWorthFetchedTabsCount = createSelector(getNetWorthState,
    (state: NetWorthState) => state.stash.tabCountFetched
);

export const selectNetWorthTabsCount = createSelector(getNetWorthState,
    (state: NetWorthState) => state.stash.tabCount
);

export const selectTabsByIds = (ids: string[]) => createSelector(
    selectNetWorthStashTabs,
    tabs => tabs.filter(tab => ids.find(id => id === tab.id))
);

export const selectSnapshotsByLeague = (league: string) => createSelector(
    selectNetWorthSnapshots,
    snapshots => snapshots.filter(snapshot => snapshot.league === league)
);

export const selectLastSnapshotByLeague = (league: string) => createSelector(
    selectSnapshotsByLeague(league),
    snapshots => snapshots[snapshots.length - 1]
);

export const selectTabSelectionByLeague = (league: string) => createSelector(
    selectNetWorthSelectedTabs,
    tabs => tabs.filter(tab => tab.league === league)
);

export const selectTabsByLeague = (league: string) => createSelector(
    selectNetWorthStashTabs,
    tabs => tabs.filter(tab => tab.league === league)
);

export const selectTotalValue = (league: string) => createSelector(
    selectLastSnapshotByLeague(league),
    snapshot => snapshot !== undefined ? snapshot.tabSnapshots.map(ts => ts.value).reduce((a, b) => a + b, 0) : 0
);

export const selectSelectedTabsValue = (league: string, tabIds: string[]) => createSelector(
    selectLastSnapshotByLeague(league),
    snapshot => snapshot !== undefined ? snapshot.tabSnapshots
        .filter(ts => tabIds.find(id => id === ts.tabId) !== undefined)
        .map(ts => ts.value).reduce((a, b) => a + b, 0) : 0
);


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

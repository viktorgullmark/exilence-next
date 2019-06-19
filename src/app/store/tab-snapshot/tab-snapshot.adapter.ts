import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { TabSnapshot } from '../../shared/interfaces/tab-snapshot.interface';

export const adapter: EntityAdapter<TabSnapshot> = createEntityAdapter<TabSnapshot>({
    selectId: (tabSnapshot: TabSnapshot) => tabSnapshot.value,
});

export const {
    selectAll: selectAllTabSnapshots,
    selectEntities: selectTabSnapshotEntities,
} = adapter.getSelectors();

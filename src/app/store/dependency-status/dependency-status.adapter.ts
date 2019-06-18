import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { DependencyStatus } from '../../shared/interfaces/dependency-status.interface';

export const adapter: EntityAdapter<DependencyStatus> = createEntityAdapter<DependencyStatus>({
    selectId: (status: DependencyStatus) => status.name,
});

export const {
    selectAll: selectAllDepStatuses,
    selectEntities: selectDepStatusEntities,
} = adapter.getSelectors();

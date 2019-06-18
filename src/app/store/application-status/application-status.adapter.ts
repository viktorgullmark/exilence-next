import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { ApplicationStatus } from '../../shared/interfaces/application-status.interface';

export const adapter: EntityAdapter<ApplicationStatus> = createEntityAdapter<ApplicationStatus>({
});

export const {
} = adapter.getSelectors();


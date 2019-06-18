import { EntityState } from '@ngrx/entity';

import { DependencyStatus } from './shared/interfaces/dependency-status.interface';

export interface AppState {
    dependencyStatusState: DependencyStatusState;
}

export interface DependencyStatusState extends EntityState<DependencyStatus> { }

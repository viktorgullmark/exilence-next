import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ApplicationState } from '../../app.states';

export const getApplicationState = createFeatureSelector<ApplicationState>('applicationState');

export const selectApplicationSession = createSelector(getApplicationState,
    (state: ApplicationState) => state.session
);

export const selectApplicationSessionCharacterLeagues = createSelector(getApplicationState,
    (state: ApplicationState) => state.session.characterLeagues
);

export const selectApplicationSessionTradeLeagues = createSelector(getApplicationState,
    (state: ApplicationState) => state.session.tradeLeagues
);

export const selectApplicationSessionLeague = createSelector(getApplicationState,
    (state: ApplicationState) => state.session.league
);

export const selectApplicationSessionCharacters = createSelector(getApplicationState,
    (state: ApplicationState) => state.session.characters
);

export const selectApplicationSessionLoading = createSelector(getApplicationState,
    (state: ApplicationState) => state.session.loading
);

export const selectApplicationSessionValidated = createSelector(getApplicationState,
    (state: ApplicationState) => state.session.validated
);

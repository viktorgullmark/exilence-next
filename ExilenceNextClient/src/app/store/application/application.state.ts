import { ApplicationState } from '../../app.states';

export const initialState: ApplicationState = {
    session: {
        sessionId: undefined,
        account: undefined,
        league: undefined,
        tradeLeague: undefined,
        loading: false,
        validated: false,
        moduleIndex: 0,
        characterLeagues: [],
        tradeLeagues: [],
        characters: []
    }
};

import { ICharacter } from './character.interface';

export interface ApplicationSession {
    account: string;
    sessionId: string;
    league: string;
    tradeLeague: string;
    validated: boolean;
    loading: boolean;
    moduleIndex: number;
    characterLeagues: string[];
    tradeLeagues: string[];
    characters: ICharacter[];
}

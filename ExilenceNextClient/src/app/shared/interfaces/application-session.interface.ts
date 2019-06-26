import { Character } from "./character.interface";

export interface ApplicationSession {
    account: string;
    sessionId: string;
    league: string;
    tradeLeague: string;
    validated: boolean;
    loading: boolean;
    leagues: string[];
    characters: Character[];
}

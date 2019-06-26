import { Character } from "./character.interface";

export interface ApplicationSession {
    account: string;
    sessionId: string;
    league: string;
    tradeLeague: string;
    loading: boolean;
    leagues: string[];
    characters: Character[];
}

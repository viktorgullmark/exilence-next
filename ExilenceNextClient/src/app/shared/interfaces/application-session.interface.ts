import { Character } from "./character.interface";
import { Tab } from "./stash.interface";

export interface ApplicationSession {
    account: string;
    sessionId: string;
    league: string;
    tradeLeague: string;
    validated: boolean;
    loading: boolean;
    leagues: string[];
    characters: Character[];
    tabs: Tab[];
}

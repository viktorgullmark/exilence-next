export interface ApplicationSession {
    account: string;
    sessionId: string;
    league: string;
    tradeLeague: string;
    validating: boolean;
    loadingLeagues: boolean;
}

import { Character } from "../interfaces/character.interface";

export class AccountHelper {
    public static GetLeagues(characters: Character[]) {
        const accountLeagues: string[] = [];
        characters.forEach(char => {
            if (accountLeagues.find(l => l === char.league) === undefined) {
                accountLeagues.push(char.league);
            }
        });

        return accountLeagues;
    }

    public static GetTradeLeagues(leagues: string[]) {
        return leagues.filter(l => l.indexOf('SSF') === -1);
    }
}

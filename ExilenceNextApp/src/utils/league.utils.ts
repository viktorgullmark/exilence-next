import { ICharacter } from '../interfaces/character.interface';
import { ILeague } from '../interfaces/league.interface';

export function getCharacterLeagues(characters: ICharacter[]) {
  const distinctLeagues: ILeague[] = [];
  characters.map((c) => {
    if (c.league) {
      const foundLeague = distinctLeagues.find((l) => l.id === c.league);
      if (!foundLeague) {
        distinctLeagues.push({ id: c.league });
      }
    }
  });
  return distinctLeagues;
}

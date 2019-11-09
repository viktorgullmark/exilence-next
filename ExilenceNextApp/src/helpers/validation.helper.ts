import { Character } from './../store/domains/character';

class ValidationHelper {
  public static noCharacters(chars: Character[]) {
    return chars.length === 0 ? 'error:no_characters_in_league' : '';
  }
}

export default ValidationHelper;

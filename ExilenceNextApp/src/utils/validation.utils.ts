import { Character } from '../store/domains/character';

class ValidationUtils {
  public static noCharacters(chars: Character[]) {
    return chars.length === 0 ? 'error:no_characters_in_league' : '';
  }
}

export default ValidationUtils;

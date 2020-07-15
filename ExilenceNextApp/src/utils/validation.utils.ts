import { Character } from '../store/domains/character';

export function noCharError(chars?: Character[]) {
  return chars && chars.length === 0 ? 'error:no_characters_in_league' : '';
}

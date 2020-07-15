import { ICharacter } from './character.interface';
import { IItem } from './item.interface';

export interface ICharacterWithItems {
  character: ICharacter;
  items: IItem[];
}

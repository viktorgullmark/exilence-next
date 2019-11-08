import { action, observable } from 'mobx';
import { persist } from 'mobx-persist';
import { ICharacter } from '../../interfaces/character.interface';
import { Character } from './character';
import { Profile } from './profile';

export class AccountLeague {
    @persist uuid: string = '';

    @persist('list', Character) @observable characters: Character[] = [];

    @action
    updateCharacters(characters: ICharacter[]) {
        const newCharacters = characters.filter(c => this.characters.find(ec => ec.name === c.name) === undefined)
        this.characters = this.characters.concat(newCharacters.map(c => {
            return new Character(c);
        }));
    }
  }
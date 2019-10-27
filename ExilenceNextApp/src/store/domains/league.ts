import { observable, action } from 'mobx';
import { persist } from 'mobx-persist';

import { ILeague } from '../../interfaces/league.interface';
import { Character } from './character';
import uuid from 'uuid';
import { ICharacter } from '../../interfaces/character.interface';

export class League implements ILeague {
    @persist uuid: string = uuid.v4();
    @persist id: string = '';
    @persist realm: string = '';
    @persist @observable selectedCharacterUuid: string = '';

    @persist('list', Character) @observable characters: Character[] = [];

    constructor(obj?: ILeague) {
        Object.assign(this, obj);
    }

    @action
    updateCharacters(characters: ICharacter[]) {
        const newCharacters = characters.filter(c => this.characters.find(ec => ec.name === ec.name) === undefined)
        this.characters = this.characters.concat(newCharacters.map(c => {
            return new Character(c);
        }));
    }
  }
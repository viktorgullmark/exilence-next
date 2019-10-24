import { observable, action } from 'mobx';
import { persist } from 'mobx-persist';

import { ILeague } from '../../interfaces/league.interface';
import { Character } from './character';
import uuid from 'uuid';
import { ICharacter } from './../../interfaces/character.interface';

export class League implements ILeague {
    @persist uuid: string = uuid.v4();
    @persist @observable id: string = '';
    @persist @observable realm: string = '';
    @persist('list', Character) @observable characters: Character[] = [];

    constructor(obj?: ILeague) {
        Object.assign(this, obj);
    }

    @action
    setCharacters(characters: ICharacter[]) {
        this.characters = characters.map(c => {
            return new Character(c);
        });
    }
  }
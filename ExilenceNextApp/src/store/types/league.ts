import { observable } from 'mobx';
import { persist } from 'mobx-persist';

import { ILeague } from '../../interfaces/league.interface';
import { Character } from './character';

export class League implements ILeague {

    @persist @observable id: string = '';
    @persist @observable description: string = '';
    @persist('list', Character) @observable characters: Character[] = [];

    constructor(obj?: ILeague) {
        Object.assign(this, obj);
    }
  }
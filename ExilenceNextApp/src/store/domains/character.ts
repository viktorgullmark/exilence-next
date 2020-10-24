import { makeObservable, observable } from 'mobx';
import { persist } from 'mobx-persist';
import { v4 as uuidv4 } from 'uuid';

import { ICharacter } from '../../interfaces/character.interface';
import { IItem } from '../../interfaces/item.interface';

export class Character implements ICharacter {
  @persist uuid: string = uuidv4();
  @persist name: string = '';
  @persist league: string = '';
  @persist classId: number = -1;
  @persist ascendancyClass: number = -1;
  @persist class: string = '';
  @persist level: number = -1;

  @persist('list') @observable inventory: IItem[] = [];
  @persist('list') @observable equipment: IItem[] = [];

  constructor(obj?: ICharacter) {
    makeObservable(this);
    Object.assign(this, obj);
  }
}

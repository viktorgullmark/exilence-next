import { observable } from 'mobx';
import { persist } from 'mobx-persist';
import uuid from 'uuid';

import { ICharacter } from '../../interfaces/character.interface';
import { IItem } from '../../interfaces/item.interface';

export class Character implements ICharacter {
  @persist uuid: string = uuid.v4();
  @persist name: string = '';
  @persist league: string = '';
  @persist classId: number = -1;
  @persist ascendancyClass: number = -1;
  @persist class: string = '';
  @persist level: number = -1;

  @persist('list') @observable inventory: IItem[] = [];
  @persist('list') @observable equipment: IItem[] = [];

  constructor(obj?: ICharacter) {
    Object.assign(this, obj);
  }
}

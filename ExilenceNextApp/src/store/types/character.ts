import { observable } from 'mobx';
import { ICharacter } from '../../interfaces/character.interface';
import { IItem } from './../../interfaces/item.interface';
import { persist } from 'mobx-persist';

export class Character implements ICharacter {

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

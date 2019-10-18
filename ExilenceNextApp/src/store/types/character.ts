import { observable } from 'mobx';
import { ICharacter } from '../../interfaces/character.interface';
import { Item } from './../../interfaces/item.interface';
import { persist } from 'mobx-persist';

export class Character implements ICharacter {
  @persist name: string;
  @persist league: string;
  @persist classId: number;
  @persist ascendancyClass: number;
  @persist class: string;
  @persist level: number;

  @persist('list') @observable inventory: Item[] = [];
  @persist('list') @observable equipment: Item[] = [];

  constructor(obj?: ICharacter) {
    this.name = obj ? obj.name : '';
    this.league = obj ? obj.league : '';
    this.classId = obj ? obj.classId : -1;
    this.ascendancyClass = obj ? obj.ascendancyClass : -1;
    this.class = obj ? obj.class : '';
    this.level = obj ? obj.level : -1;
  }
}

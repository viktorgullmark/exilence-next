import { makeObservable, observable } from 'mobx';
import { persist } from 'mobx-persist';
import { v4 as uuidv4 } from 'uuid';

import { ICharacter } from '../../interfaces/character.interface';
import { IItem } from '../../interfaces/item.interface';

export class Character implements ICharacter {
  @persist uuid: string = uuidv4();
  @persist id: string = '';
  @persist name: string = '';
  @persist class: string = '';
  @persist level: number = -1;
  @persist experience: number = -1;
  @persist league?: string;
  @persist expired?: boolean;
  @persist current?: boolean;
  @persist deleted?: boolean;
  @persist('list') @observable inventory: IItem[] = [];
  @persist('list') @observable equipment: IItem[] = [];
  @persist('list') @observable jewels: IItem[] = [];

  constructor(obj?: ICharacter) {
    makeObservable(this);
    Object.assign(this, obj);
  }
}

import { persist } from 'mobx-persist';
import { v4 as uuidv4 } from 'uuid';

import { IColour, IStashTab } from '../../interfaces/stash.interface';

export class StashTab implements IStashTab {
  @persist uuid: string = uuidv4();
  @persist n: string = '';
  @persist i: number = 0;
  @persist id: string = '';
  @persist type: string = '';
  @persist hidden: boolean = false;
  @persist selected: boolean = false;
  @persist('object') colour: IColour = { r: 0, g: 0, b: 0 };
  @persist srcL: string = '';
  @persist srcC: string = '';
  @persist srcR: string = '';

  constructor(obj?: IStashTab) {
    Object.assign(this, obj);
  }
}

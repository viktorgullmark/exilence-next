import { persist } from 'mobx-persist';
import uuid from 'uuid';
import { IColour, IStashTab } from '../../interfaces/stash.interface';

export class StashTab implements IStashTab {
  @persist uuid: string = uuid.v4();
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

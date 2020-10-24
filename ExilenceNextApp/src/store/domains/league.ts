import { makeObservable } from 'mobx';
import { persist } from 'mobx-persist';
import { v4 as uuidv4 } from 'uuid';

import { ILeague } from './../../interfaces/league.interface';

export class League implements ILeague {
  @persist uuid: string = uuidv4();
  @persist id: string = '';
  @persist realm: string = '';

  constructor(obj?: ILeague) {
    makeObservable(this);
    Object.assign(this, obj);
  }
}

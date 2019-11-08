import uuid from 'uuid';
import { ILeague } from './../../interfaces/league.interface';
import { persist } from 'mobx-persist';

export class League implements ILeague {
    @persist uuid: string = uuid.v4();
    @persist id: string = '';
    @persist realm: string = '';

    constructor(obj?: ILeague) {
        Object.assign(this, obj);
    }
  }
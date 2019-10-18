import { observable } from 'mobx';
import { persist } from 'mobx-persist';

import { ILeague } from '../../interfaces/league.interface';

export class League implements ILeague {
    @persist @observable id: string;
    @persist @observable description: string;
  
    constructor(obj?: ILeague) {
        this.id = obj ? obj.id : '';
        this.description = obj ? obj.description : '';
    }
  }
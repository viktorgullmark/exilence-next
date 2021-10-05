import { makeObservable } from 'mobx';
import { persist } from 'mobx-persist';
import { v4 as uuidv4 } from 'uuid';

import { IMetaData, IStashTab } from '../../interfaces/stash.interface';

export class StashTab implements IStashTab {
  @persist uuid: string = uuidv4();
  @persist id: string = '';
  @persist name: string = '';
  @persist index: number = 0;
  @persist type: string = '';
  @persist parent?: string;
  @persist folder?: boolean;
  @persist public?: boolean;
  @persist('object') metadata: IMetaData = { colour: '' };

  constructor(obj?: IStashTab) {
    makeObservable(this);
    Object.assign(this, obj);
  }
}

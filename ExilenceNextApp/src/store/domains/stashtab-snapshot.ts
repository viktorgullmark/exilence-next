import { persist } from 'mobx-persist';
import { v4 as uuidv4 } from 'uuid';

import { IPricedItem } from '../../interfaces/priced-item.interface';
import { IStashTabSnapshot } from '../../interfaces/stash-tab-snapshot.interface';

export class StashTabSnapshot implements IStashTabSnapshot {
  @persist uuid: string = uuidv4();
  @persist stashTabId: string = '';
  @persist value: number = 0;
  @persist('list') pricedItems: IPricedItem[] = [];

  constructor(obj?: IStashTabSnapshot) {
    Object.assign(this, obj);
  }
}

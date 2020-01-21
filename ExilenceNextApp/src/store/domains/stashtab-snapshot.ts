import { persist } from 'mobx-persist';
import uuid from 'uuid';
import { IPricedItem } from '../../interfaces/priced-item.interface';
import { IStashTabSnapshot } from '../../interfaces/stash-tab-snapshot.interface';

export class StashTabSnapshot implements IStashTabSnapshot {
    @persist uuid: string = uuid.v4();
    @persist stashTabId: string = '';
    @persist value: number = 0;
    @persist('list') pricedItems: IPricedItem[] = [];

    constructor(obj?: IStashTabSnapshot) {
        Object.assign(this, obj);
    }
  }
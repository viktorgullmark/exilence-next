import { persist } from 'mobx-persist';
import uuid from 'uuid';
import { ISnapshot } from './../../interfaces/snapshot.interface';
import { IStashTabSnapshot } from './../../interfaces/stash-tab-snapshot.interface';

export class Snapshot implements ISnapshot {
    @persist uuid: string = uuid.v4();
    @persist timestamp: Date = new Date();
    @persist stashTabSnapshots: IStashTabSnapshot[] = [];

    constructor(obj?: ISnapshot) {
        Object.assign(this, obj);
    }
  }
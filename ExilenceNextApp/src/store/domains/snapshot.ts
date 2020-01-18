import { persist } from 'mobx-persist';
import moment, { Moment } from 'moment';
import uuid from 'uuid';
import { ISnapshot } from './../../interfaces/snapshot.interface';
import { StashTabSnapshot } from './stashtab-snapshot';

export class Snapshot implements ISnapshot {
    @persist uuid: string = uuid.v4();
    @persist('object') created: Date = new Date();
    @persist('list', StashTabSnapshot) stashTabSnapshots: StashTabSnapshot[] = [];

    constructor(obj?: ISnapshot) {
        Object.assign(this, obj);
    }
  }
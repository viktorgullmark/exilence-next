import { persist } from 'mobx-persist';
import uuid from 'uuid';
import { ISnapshot } from './../../interfaces/snapshot.interface';
import { IStashTabSnapshot } from './../../interfaces/stash-tab-snapshot.interface';
import moment, { Moment } from 'moment';

export class Snapshot implements ISnapshot {
    @persist uuid: string = uuid.v4();
    @persist('object') timestamp: Moment = moment();
    @persist('list') stashTabSnapshots: IStashTabSnapshot[] = [];

    constructor(obj?: ISnapshot) {
        Object.assign(this, obj);
    }
  }
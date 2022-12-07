import { persist } from 'mobx-persist';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { INetWorthSessionOffsets } from '../../interfaces/snapshot-networth-session.interface';

import { ISnapshot } from './../../interfaces/snapshot.interface';
import { StashTabSnapshot } from './stashtab-snapshot';

export class Snapshot implements ISnapshot {
  @persist uuid: string = uuidv4();
  @persist('object') created: Date = moment.utc().toDate();
  @persist('list', StashTabSnapshot) stashTabSnapshots: StashTabSnapshot[] = [];
  @persist('object') networthSessionOffsets: INetWorthSessionOffsets | undefined;

  constructor(obj?: ISnapshot) {
    Object.assign(this, obj);
  }
}

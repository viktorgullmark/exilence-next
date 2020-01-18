import uuid from 'uuid';
import { IApiGroup } from '../../interfaces/api/api-group.interface';
import { IApiConnection } from '../../interfaces/api/api-connection.interface';
import { computed, observable, action } from 'mobx';
import { SnapshotUtils } from '../../utils/snapshot.utils';
import { stores } from '../..';

export class Group implements IApiGroup {
  uuid: string = uuid.v4();
  name: string = '';
  created: Date = new Date();
  @observable connections: IApiConnection[] = [];
  @observable activeAccounts: string[] = [];

  constructor(obj?: IApiGroup) {
    Object.assign(this, obj);
  }

  snapshotFlattener(onlyLatest?: boolean) {
    return this.connections
      .flatMap(c => c.account)
      .filter(a => this.activeAccounts.includes(a.uuid))
      .flatMap(a => {
        const filter = a.profiles.filter(ap => ap.active).flatMap(p => p.snapshots);
        return onlyLatest && filter.length > 0 ? [filter[0]] : filter;
      });
  }

  @action
  addConnection(connection: IApiConnection) {
    this.connections = this.connections.concat([connection]);
  }

  @action
  removeConnection(connectionId: string) {
    this.connections = this.connections.filter(
      c => c.connectionId !== connectionId
    );
  }

  @computed
  get groupSnapshots() {
    return this.snapshotFlattener();
  }

  @computed
  get latestGroupSnapshots() {
    return this.snapshotFlattener(true);
  }

  @computed
  get items() {
    if (this.latestGroupSnapshots.length === 0) {
      return [];
    }
    return SnapshotUtils.filterItems(this.latestGroupSnapshots);
  }

  @computed
  get netWorthValue() {
    if (this.latestGroupSnapshots.length === 0) {
      return 0;
    }
    return SnapshotUtils.calculateNetWorth(this.latestGroupSnapshots);
  }

  @computed
  get itemCount() {
    if (this.latestGroupSnapshots.length === 0) {
      return 0;
    }
    return SnapshotUtils.getItemCount(this.latestGroupSnapshots);
  }

  @action
  setActiveAccounts(uuids: string[]) {
    this.activeAccounts = uuids;
  }

  @action
  selectAccount(uuid: string) {
    const foundUuid = this.activeAccounts.find(aid => aid === uuid);
    if (!foundUuid) {
      this.activeAccounts.push(uuid);
    }
  }

  @action
  deselectAccount(uuid: string) {
    const foundUuid = this.activeAccounts.find(aid => aid === uuid);
    if (foundUuid) {
      const index = this.activeAccounts.indexOf(foundUuid);
      this.activeAccounts.splice(index, 1);
    }
  }
}

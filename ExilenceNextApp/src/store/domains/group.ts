import uuid from 'uuid';
import { IApiGroup } from '../../interfaces/api/api-group.interface';
import { IApiConnection } from '../../interfaces/api/api-connection.interface';
import { computed, observable, action } from 'mobx';
import { stores } from '../..';
import moment from 'moment';
import {
  getValueForSnapshotsTabs,
  filterItems,
  calculateNetWorth,
  formatSnapshotsForChart,
  getItemCount,
  mapSnapshotToApiSnapshot
} from '../../utils/snapshot.utils';

export class Group implements IApiGroup {
  uuid: string = uuid.v4();
  name: string = '';
  created: Date = moment.utc().toDate();
  @observable connections: IApiConnection[] = [];
  @observable activeAccounts: string[] = [];

  constructor(obj?: IApiGroup) {
    Object.assign(this, obj);
  }

  snapshotFlattener(onlyLatest?: boolean, excludeSnapshotId?: string) {
    return this.connections
      .flatMap(c => c.account)
      .filter(a => this.activeAccounts.includes(a.uuid))
      .flatMap(a => {
        let filter = a.profiles
          .filter(ap => ap.active)
          .flatMap(p => p.snapshots);

        if (excludeSnapshotId) {
          filter = filter.filter(s => s.uuid !== excludeSnapshotId);
        }

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
  get lastSnapshotChange() {
    if (this.groupSnapshots.length < 2) {
      return 0;
    }

    const latestSnapshot = this.latestGroupSnapshots[0];

    const netWorthValue = getValueForSnapshotsTabs(
      this.latestGroupSnapshotsExceptLast(latestSnapshot.uuid)
    );

    const lastSnapshotNetWorth = getValueForSnapshotsTabs([latestSnapshot]);

    return lastSnapshotNetWorth - netWorthValue;
  }

  @computed
  get timeSinceLastSnapshot() {
    if (this.groupSnapshots.length === 0) {
      return undefined;
    }
    return moment(this.groupSnapshots[0].created).fromNow();
  }

  @computed
  get income() {
    let incomeForGroup = 0;
    const hours = 1;
    const hoursAgo = moment()
      .utc()
      .subtract(hours, 'hours');

    this.connections.forEach((c: IApiConnection) => {
      const activeProfile = c.account.profiles.find(p => p.active);
      const snapshots = activeProfile?.snapshots.filter(s =>
        moment(s.created)
          .utc()
          .isAfter(hoursAgo)
      );

      if (snapshots && snapshots.length > 1) {
        const lastSnapshot = snapshots[0];
        const firstSnapshot = snapshots[snapshots.length - 1];
        const incomePerHour =
          (calculateNetWorth([lastSnapshot]) -
            calculateNetWorth([firstSnapshot])) /
          hours;
        incomeForGroup += incomePerHour;
      }
    });

    return incomeForGroup;
  }

  @computed
  get groupSnapshots() {
    return this.snapshotFlattener();
  }

  @computed
  get latestGroupSnapshots() {
    return this.snapshotFlattener(true);
  }

  latestGroupSnapshotsExceptLast(excludeSnapshotId: string) {
    return this.snapshotFlattener(true, excludeSnapshotId);
  }

  @computed
  get items() {
    if (this.latestGroupSnapshots.length === 0) {
      return [];
    }
    return filterItems(this.latestGroupSnapshots);
  }

  @computed
  get netWorthValue() {
    if (this.latestGroupSnapshots.length === 0) {
      return 0;
    }
    return calculateNetWorth(this.latestGroupSnapshots);
  }

  @computed
  get itemCount() {
    if (this.latestGroupSnapshots.length === 0) {
      return 0;
    }
    return getItemCount(this.latestGroupSnapshots);
  }

  @computed
  get chartData() {
    if (this.groupSnapshots.length === 0) {
      return [];
    }
    return formatSnapshotsForChart(this.groupSnapshots);
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

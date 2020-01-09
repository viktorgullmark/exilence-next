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
        const filter = a.profiles.flatMap(p =>
          p.snapshots.filter(
            s =>
              s.tabsFetchedCount === p.activeStashTabIds.length ||
              a.uuid === stores.accountStore.getSelectedAccount.uuid
          )
        );
        return onlyLatest ? filter[0] : filter;
      });
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
    if (this.groupSnapshots.length === 0) {
      return [];
    }
    return SnapshotUtils.filterItems(this.groupSnapshots);
  }

  @computed
  get netWorthValue() {
    if (this.groupSnapshots.length === 0) {
      return 0;
    }
    return SnapshotUtils.calculateNetWorth(this.groupSnapshots);
  }

  @computed
  get itemCount() {
    if (this.groupSnapshots.length === 0) {
      return 0;
    }
    return SnapshotUtils.getItemCount(this.groupSnapshots);
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

import { action, computed, makeObservable, observable } from 'mobx';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { rootStore } from '../..';
import { IApiConnection } from '../../interfaces/api/api-connection.interface';
import { IApiGroup } from '../../interfaces/api/api-group.interface';
import { IGroupChartSeries } from '../../interfaces/group-chart-series.interface';
import { ISparklineDataPoint } from '../../interfaces/sparkline-data-point.interface';
import {
  calculateNetWorth,
  diffSnapshots,
  filterItems,
  filterSnapshotItems,
  formatSnapshotsForChart,
  getItemCount,
  getValueForSnapshot,
  getValueForSnapshotsTabs,
} from '../../utils/snapshot.utils';

export class Group implements IApiGroup {
  uuid: string = uuidv4();
  name: string = '';
  created: Date = moment.utc().toDate();
  @observable connections: IApiConnection[] = [];
  @observable activeAccounts: string[] = [];

  constructor(obj?: IApiGroup) {
    makeObservable(this);
    Object.assign(this, obj);
  }

  snapshotFlattener(onlyLatest?: boolean, excludeSnapshotId?: string) {
    return this.connections
      .flatMap((c) => c.account)
      .filter((a) => this.activeAccounts.includes(a.uuid))
      .flatMap((a) => {
        let profileSnapshots = a.profiles
          .filter((ap) => ap.active)
          .flatMap((p) => p.snapshots)
          .sort((a, b) => (moment(a.created).isBefore(b.created) ? 1 : -1));

        if (excludeSnapshotId) {
          profileSnapshots = profileSnapshots.filter((s) => s.uuid !== excludeSnapshotId);
        }

        return onlyLatest && profileSnapshots.length > 0 ? [profileSnapshots[0]] : profileSnapshots;
      });
  }

  @action
  addConnection(connection: IApiConnection) {
    this.connections = this.connections.concat([connection]);
  }

  @action
  removeConnection(connectionId: string) {
    this.connections = this.connections.filter((c) => c.connectionId !== connectionId);
  }

  @computed
  get sparklineChartData(): ISparklineDataPoint[] | undefined {
    const snapshots = [...this.latestGroupSnapshots.slice(0, 10)];
    if (snapshots.length === 0) {
      return;
    }
    return snapshots.map((s, i) => {
      return {
        x: i + 1,
        y: getValueForSnapshot(s),
      } as ISparklineDataPoint;
    });
  }

  @computed
  get lastSnapshotChange() {
    if (this.groupSnapshots.length < 2) {
      return 0;
    }

    const latestSnapshot = this.latestGroupSnapshots.sort((a, b) =>
      moment(a.created).isBefore(b.created) ? 1 : -1
    )[0];

    let previousNetworth = getValueForSnapshotsTabs(
      this.latestGroupSnapshotsExceptLast(latestSnapshot.uuid)
    );

    let newNetworth = getValueForSnapshotsTabs(this.latestGroupSnapshots);

    if (rootStore.settingStore.currency === 'exalt' && rootStore.priceStore.exaltedPrice) {
      newNetworth = newNetworth / rootStore.priceStore.exaltedPrice;
      previousNetworth = previousNetworth / rootStore.priceStore.exaltedPrice;
    }
    if (rootStore.settingStore.currency === 'divine' && rootStore.priceStore.divinePrice) {
      newNetworth = newNetworth / rootStore.priceStore.divinePrice;
      previousNetworth = previousNetworth / rootStore.priceStore.divinePrice;
    }
    return newNetworth - previousNetworth;
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
    const hoursAgo = moment().utc().subtract(hours, 'hours');

    this.connections.forEach((c: IApiConnection) => {
      const activeProfile = c.account.profiles.find((p) => p.active);
      const snapshots = activeProfile?.snapshots.filter((s) =>
        moment(s.created).utc().isAfter(hoursAgo)
      );

      if (snapshots && snapshots.length > 1) {
        const lastSnapshot = snapshots[0];
        const firstSnapshot = snapshots[snapshots.length - 1];
        const incomePerHour =
          (calculateNetWorth([lastSnapshot]) - calculateNetWorth([firstSnapshot])) / hours;
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
    const diffSelected = rootStore.uiStateStore.itemTableSelection === 'comparison';
    if (
      this.latestGroupSnapshots.length === 0 ||
      (diffSelected && this.latestGroupSnapshots.length < 2)
    ) {
      return [];
    }
    if (diffSelected) {
      return filterItems(diffSnapshots(this.latestGroupSnapshots[1], this.latestGroupSnapshots[0]));
    }
    return filterSnapshotItems(this.latestGroupSnapshots);
  }

  @computed
  get netWorthValue() {
    if (this.latestGroupSnapshots.length === 0) {
      return 0;
    }
    let calculatedValue = calculateNetWorth(this.latestGroupSnapshots);
    if (rootStore.settingStore.currency === 'exalt' && rootStore.priceStore.exaltedPrice) {
      calculatedValue = calculatedValue / rootStore.priceStore.exaltedPrice;
    }
    if (rootStore.settingStore.currency === 'divine' && rootStore.priceStore.divinePrice) {
      calculatedValue = calculatedValue / rootStore.priceStore.divinePrice;
    }
    return calculatedValue;
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
    const groupChartSeries: IGroupChartSeries = {
      connections: [],
    };

    this.connections.forEach((c: IApiConnection) => {
      const activeProfile = c.account.profiles.find((p) => p.active);

      if (activeProfile?.snapshots && activeProfile.snapshots.length > 0) {
        const chartSeries = formatSnapshotsForChart(activeProfile?.snapshots);
        groupChartSeries.connections.push({
          seriesName: c.account.name,
          series: chartSeries,
        });
      }
    });

    return [groupChartSeries];
  }

  @action
  setActiveAccounts(uuids: string[]) {
    this.activeAccounts = uuids;
  }

  @action
  selectAccount(uuid: string) {
    const foundUuid = this.activeAccounts.find((aid) => aid === uuid);
    if (!foundUuid) {
      this.activeAccounts.push(uuid);
    }
  }

  @action
  deselectAccount(uuid: string) {
    const foundUuid = this.activeAccounts.find((aid) => aid === uuid);
    if (foundUuid) {
      const index = this.activeAccounts.indexOf(foundUuid);
      this.activeAccounts.splice(index, 1);
    }
  }
}

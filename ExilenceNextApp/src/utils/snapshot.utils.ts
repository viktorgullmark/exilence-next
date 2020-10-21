import moment from 'moment';

import { rootStore } from '..';
import { IPricedItem } from '../interfaces/api/api-priced-item.interface';
import { IApiSnapshot } from '../interfaces/api/api-snapshot.interface';
import { IApiStashTabSnapshot } from '../interfaces/api/api-stash-tab-snapshot.interface';
import { IApiStashTabPricedItem } from '../interfaces/api/api-stashtab-priceditem.interface';
import { IChartStashTabSnapshot } from '../interfaces/chart-stash-tab-snapshot.interface';
import { IStashTab } from '../interfaces/stash.interface';
import { Snapshot } from '../store/domains/snapshot';
import { rgbToHex } from './colour.utils';
import { getRarityIdentifier, mergeItemStacks } from './item.utils';

export const mapSnapshotToApiSnapshot = (snapshot: Snapshot, stashTabs?: IStashTab[]) => {
  return {
    uuid: snapshot.uuid,
    created: snapshot.created,
    stashTabs: stashTabs
      ? stashTabs
          .filter((st) => snapshot.stashTabSnapshots.map((sts) => sts.stashTabId).includes(st.id))
          .map((st) => {
            const foundTab = snapshot.stashTabSnapshots.find((sts) => sts.stashTabId === st.id)!;

            return {
              uuid: foundTab.uuid,
              stashTabId: st.id,
              pricedItems: foundTab.pricedItems,
              index: st.i,
              value: +foundTab.value.toFixed(4),
              color: rgbToHex(st.colour.r, st.colour.g, st.colour.b),
              name: st.n,
            } as IApiStashTabSnapshot;
          })
      : snapshot.stashTabSnapshots,
  } as IApiSnapshot;
};

export const mapSnapshotsToStashTabPricedItems = (snapshot: Snapshot, stashTabs: IStashTab[]) => {
  return stashTabs
    .filter((st) => snapshot.stashTabSnapshots.map((sts) => sts.stashTabId).includes(st.id))
    .map((st) => {
      const foundTab = snapshot.stashTabSnapshots.find((sts) => sts.stashTabId === st.id)!;

      return {
        uuid: foundTab.uuid,
        stashTabId: st.id,
        pricedItems: foundTab.pricedItems.map((i) => {
          return { ...i, uuid: i.uuid, itemId: i.itemId } as IPricedItem;
        }),
      } as IApiStashTabPricedItem;
    });
};

export const getSnapshotCardValue = (snapshotCount: number) => {
  let label = `${snapshotCount}${snapshotCount >= 1000 ? '+' : ''}`;
  return label;
};

export const getValueForSnapshot = (snapshot: IApiSnapshot) => {
  return snapshot.stashTabs.map((sts) => sts.value).reduce((a, b) => a + b, 0);
};

export const getValueForSnapshotsTabs = (snapshots: IApiSnapshot[]) => {
  return snapshots
    .flatMap((sts) => sts.stashTabs)
    .flatMap((sts) => sts.value)
    .reduce((a, b) => a + b, 0);
};

export const getValueForSnapshotsTabsItems = (snapshots: IApiSnapshot[]) => {
  return snapshots
    .flatMap((sts) => sts.stashTabs)
    .flatMap((sts) => sts.pricedItems)
    .flatMap((item) => item.total)
    .reduce((a, b) => a + b, 0);
};

export const calculateNetWorth = (snapshots: IApiSnapshot[]) => {
  const values = getValueForSnapshotsTabs(snapshots);

  return values;
};

export const formatValue = (
  value: number | string | undefined,
  suffix: string | undefined,
  change?: boolean,
  displayZero?: boolean
) => {
  if (!value || typeof value === 'string') {
    return !displayZero ? '' : `0 ${suffix}`;
  }
  let valueString = value > 0 && change ? '+ ' : '';
  valueString += value.toLocaleString(undefined, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });

  valueString = valueString.replace('-', '- ').replace('−', '− ');

  if (value === 0) {
    valueString = '0';
  }

  return `${valueString} ${suffix}`;
};

export const formatSnapshotsForChart = (snapshots: IApiSnapshot[]): number[][] => {
  return snapshots
    .map((s) => {
      const values: number[] = [
        moment(new Date(s.created).getTime()).valueOf(),
        +getValueForSnapshot(s).toFixed(2),
      ];
      return values;
    })
    .sort((n1, n2) => n1[0] - n2[0]);
};

export const formatStashTabSnapshotsForChart = (
  stashTabSnapshots: IChartStashTabSnapshot[]
): number[][] => {
  return stashTabSnapshots
    .map((s) => {
      const values: number[] = [
        moment(new Date(s.created).getTime()).valueOf(),
        +s.value.toFixed(2),
      ];
      return values;
    })
    .sort((n1, n2) => n1[0] - n2[0]);
};

export const filterItems = (snapshots: IApiSnapshot[]) => {
  if (snapshots.length === 0) {
    return [];
  }

  const filterText = rootStore.uiStateStore.itemTableFilterText.toLowerCase();

  const rarity = getRarityIdentifier(filterText);

  const mergedItems = mergeItemStacks(
    snapshots
      .flatMap((sts) =>
        sts.stashTabs.filter(
          (st) =>
            !rootStore.uiStateStore.filteredStashTabs ||
            rootStore.uiStateStore.filteredStashTabs.map((fst) => fst.id).includes(st.stashTabId)
        )
      )
      .flatMap((sts) =>
        sts.pricedItems.filter(
          (i) =>
            (i.calculated > 0 && i.name.toLowerCase().includes(filterText)) ||
            (i.tab &&
              i.tab
                .map((t) => t.n)
                .join(', ')
                .toLowerCase()
                .includes(filterText)) ||
            (i.calculated > 0 && rarity >= 0 && i.frameType === rarity)
        )
      )
  );

  return mergedItems;
};

export const getItemCount = (snapshots: IApiSnapshot[]) => {
  return mergeItemStacks(
    snapshots
      .flatMap((sts) => sts.stashTabs)
      .flatMap((sts) => sts.pricedItems.filter((i) => i.calculated > 0))
  ).length;
};

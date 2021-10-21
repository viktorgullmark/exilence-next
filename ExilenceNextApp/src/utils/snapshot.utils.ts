import moment from 'moment';
import { rootStore } from '..';
import { IApiSnapshot } from '../interfaces/api/api-snapshot.interface';
import { IApiStashTabSnapshot } from '../interfaces/api/api-stash-tab-snapshot.interface';
import { IApiStashTabPricedItem } from '../interfaces/api/api-stashtab-priceditem.interface';
import { IChartStashTabSnapshot } from '../interfaces/chart-stash-tab-snapshot.interface';
import { IPricedItem } from '../interfaces/priced-item.interface';
import { IStashTab } from '../interfaces/stash.interface';
import { Snapshot } from '../store/domains/snapshot';
import { findItem, getRarityIdentifier, mergeItemStacks } from './item.utils';

export const mapSnapshotToApiSnapshot = (snapshot: Snapshot, stashTabs?: IStashTab[]) => {
  const filteredLeagueTabs = stashTabs?.filter((st) =>
    snapshot.stashTabSnapshots.map((sts) => sts.stashTabId).includes(st.id)
  );
  return {
    uuid: snapshot.uuid,
    created: snapshot.created,
    stashTabs: stashTabs
      ? snapshot.stashTabSnapshots.map((st) => {
          const foundTab = filteredLeagueTabs?.find((lt) => lt.id === st.stashTabId);
          return {
            uuid: st.uuid,
            stashTabId: foundTab?.id,
            pricedItems: st.pricedItems,
            index: foundTab?.index,
            value: st.value,
            color: foundTab ? foundTab.metadata.colour : undefined,
            name: foundTab?.name,
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

export const getSnapshotCardValue = (snapshotCount: number) =>
  `${snapshotCount}${snapshotCount >= 1000 ? '+' : ''}`;

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

export const calculateNetWorth = (snapshots: IApiSnapshot[]) => getValueForSnapshotsTabs(snapshots);

export const formatValue = (
  value: number | string | undefined,
  suffix: string | undefined,
  change?: boolean,
  displayZero?: boolean,
  unavailable?: boolean
) => {
  if (!value || typeof value === 'string') {
    return !displayZero ? '' : `0 ${suffix}`;
  }
  const roundedValue = Math.round(value * 100) / 100;
  let valueString = roundedValue > 0 && change ? '+ ' : '';
  valueString += roundedValue.toLocaleString(undefined, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });

  valueString = valueString.replace('-', '- ').replace('−', '− ');

  if (roundedValue === 0 || unavailable) {
    valueString = '0';
  }

  return `${valueString} ${suffix}`;
};

export const formatSnapshotsForChart = (snapshots: IApiSnapshot[]): number[][] =>
  snapshots
    .map((s) => [
      moment(new Date(s.created).getTime()).valueOf(),
      +getValueForSnapshot(s).toFixed(2),
    ])
    .sort((n1, n2) => n1[0] - n2[0]);

export const formatStashTabSnapshotsForChart = (
  stashTabSnapshots: IChartStashTabSnapshot[]
): number[][] => {
  return stashTabSnapshots
    .map((s) => [moment(new Date(s.created).getTime()).valueOf(), +s.value.toFixed(2)])
    .sort((n1, n2) => n1[0] - n2[0]);
};

export const diffSnapshots = (snapshot1: IApiSnapshot, snapshot2: IApiSnapshot): IPricedItem[] => {
  const difference: IPricedItem[] = [];
  const itemsInSnapshot1 = mergeItemStacks(snapshot1.stashTabs.flatMap((sts) => sts.pricedItems));
  const itemsInSnapshot2 = mergeItemStacks(snapshot2.stashTabs.flatMap((sts) => sts.pricedItems));

  // items that exist in snapshot 2 but not in snapshot 1 & items that exist in both snapshots but should be updated
  const itemsToAdd = itemsInSnapshot2.filter((x) => findItem(itemsInSnapshot1, x) === undefined);
  const itemsToUpdate = itemsInSnapshot2.filter((x) => {
    const foundItem = findItem(itemsInSnapshot1, x);
    return foundItem !== undefined && x.stackSize !== foundItem.stackSize;
  });
  itemsToUpdate.concat(itemsToAdd).map((item) => {
    const existingItem = findItem(itemsInSnapshot1, item);
    if (existingItem) {
      const recentItem = Object.assign({}, item);
      recentItem.stackSize = recentItem.stackSize - existingItem.stackSize;
      existingItem.total = recentItem.calculated * existingItem.stackSize;
      recentItem.total = recentItem.total - existingItem.total;
      if (recentItem.total !== 0 && recentItem.stackSize !== 0) {
        difference.push(recentItem);
      }
    } else if (item.total !== 0 && item.stackSize !== 0) {
      difference.push(item);
    }
  });

  // items that exist in snapshot 1 but not in snapshot 2
  const itemsToRemove = itemsInSnapshot1.filter((x) => findItem(itemsInSnapshot2, x) === undefined);
  itemsToRemove.map((item) => {
    const existingItem = findItem(itemsInSnapshot2, item);
    const recentItem = Object.assign({}, item);
    if (recentItem.total !== 0 && recentItem.stackSize !== 0) {
      if (existingItem !== undefined) {
        recentItem.stackSize = existingItem.stackSize - recentItem.stackSize;
        existingItem.total = recentItem.calculated * existingItem.stackSize;
        recentItem.total = existingItem.total - recentItem.total;
      } else {
        recentItem.total = -Math.abs(recentItem.total);
        recentItem.stackSize = -Math.abs(recentItem.stackSize);
      }
      difference.push(recentItem);
    }
  });
  return difference;
};

export const filterItems = (items: IPricedItem[]) => {
  const filterText = rootStore.uiStateStore.bulkSellView
    ? rootStore.uiStateStore.bulkSellItemTableFilterText.toLowerCase()
    : rootStore.uiStateStore.itemTableFilterText.toLowerCase();

  const rarity = getRarityIdentifier(filterText);

  let itemNameRegex = new RegExp('', 'i');
  try {
    // try/catch required because of filtering being an onChange event, example: typing only [ would lead to a SyntaxError
    itemNameRegex = new RegExp(filterText, 'i');
  } catch (error) {
    console.error(error);
  }

  return mergeItemStacks(
    items.filter(
      (i) =>
        (i.calculated > 0 && i.name.toLowerCase().includes(filterText)) ||
        (i.tab &&
          i.tab
            .map((t) => t.name)
            .join(', ')
            .toLowerCase()
            .includes(filterText)) ||
        (i.calculated > 0 && rarity >= 0 && i.frameType === rarity) ||
        itemNameRegex.test(i.name)
    )
  );
};

export const filterSnapshotItems = (snapshots: IApiSnapshot[]) => {
  if (snapshots.length === 0) {
    return [];
  }
  const filterText = rootStore.uiStateStore.bulkSellView
    ? rootStore.uiStateStore.bulkSellItemTableFilterText.toLowerCase()
    : rootStore.uiStateStore.itemTableFilterText.toLowerCase();

  const rarity = getRarityIdentifier(filterText);

  let itemNameRegex = new RegExp('', 'i');
  try {
    // try/catch required because of filtering being an onChange event, example: typing only [ would lead to a SyntaxError
    itemNameRegex = new RegExp(filterText, 'i');
  } catch (error) {
    console.error(error);
  }

  return mergeItemStacks(
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
                .map((t) => t.name)
                .join(', ')
                .toLowerCase()
                .includes(filterText)) ||
            (i.calculated > 0 && rarity >= 0 && i.frameType === rarity) ||
            itemNameRegex.test(i.name)
        )
      )
  );
};

export const getItemCount = (snapshots: IApiSnapshot[]) => {
  return mergeItemStacks(
    snapshots
      .flatMap((sts) => sts.stashTabs)
      .flatMap((sts) => sts.pricedItems.filter((i) => i.calculated > 0))
  ).length;
};

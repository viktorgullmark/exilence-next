import moment from 'moment';
import { IApiSnapshot } from '../interfaces/api/api-snapshot.interface';
import { IApiStashTabSnapshot } from '../interfaces/api/api-stash-tab-snapshot.interface';
import { IApiStashTabPricedItem } from '../interfaces/api/api-stashtab-priceditem.interface';
import { IChartStashTabSnapshot } from '../interfaces/chart-stash-tab-snapshot.interface';
import { IDataChartSeries } from '../interfaces/connection-chart-series.interface';
import { IPricedItem } from '../interfaces/priced-item.interface';
import { IStashTab } from '../interfaces/stash.interface';
import { Session } from '../store/domains/session';
import { Snapshot } from '../store/domains/snapshot';
import { findItem, getRarityIdentifier, mergeItemStacks } from './item.utils';
// Do not import rootstore or the tests doesn´t work anymore

export const mapSnapshotToApiSnapshot = (snapshot: Snapshot, stashTabs?: IStashTab[]) => {
  const filteredLeagueTabs = stashTabs?.filter((st) =>
    snapshot.stashTabSnapshots.map((sts) => sts.stashTabId).includes(st.id)
  );
  return {
    uuid: snapshot.uuid,
    created: snapshot.created,
    networthSessionOffsets: { ...snapshot.networthSessionOffsets },
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
      : [...snapshot.stashTabSnapshots], // Clone stashtabs to prevent conflicts with domain
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

export const getValueForSnapshotsItems = (items: IPricedItem[]) => {
  return items.flatMap((item) => item.total).reduce((a, b) => a + b, 0);
};

export const calculateNetWorth = (snapshots: IApiSnapshot[]) => getValueForSnapshotsTabs(snapshots);

export const calculateNetWorthItems = (items: IPricedItem[]) => getValueForSnapshotsItems(items);

export const calculateSessionIncome = (
  lastSnapshot: IApiSnapshot,
  firstSnapshot: IApiSnapshot | undefined
) => {
  let incomePerHour = 0;
  if (lastSnapshot.networthSessionOffsets !== undefined && firstSnapshot) {
    const sessionDuration = lastSnapshot.networthSessionOffsets.sessionDuration;
    let hoursToCalcOver = sessionDuration / 1000 / 60 / 60;
    hoursToCalcOver = hoursToCalcOver >= 1 ? hoursToCalcOver : 1;

    incomePerHour =
      (calculateNetWorth([lastSnapshot]) - calculateNetWorth([firstSnapshot])) / hoursToCalcOver;
  } else {
    return 0;
  }
  return incomePerHour;
};

export const calculateRelativTimeStampValue = (
  prevSnapshot: { value: number; created: number },
  time: number,
  afterSnapshot: { value: number; created: number }
) => {
  // 10 = 15 - 5
  const cleanedSnapshotTime = afterSnapshot.created - prevSnapshot.created;
  // 2 = 7 - 5
  const cleanedTimeStampTime = time - prevSnapshot.created;
  // 0.2 = 2 / 10
  const percentageTime = cleanedTimeStampTime / cleanedSnapshotTime;
  // 100 = 150 - 50
  const cleanedSnapshotNetWorth = afterSnapshot.value - prevSnapshot.value;
  // 20 = 100 * 0.2
  const relativNetworth = cleanedSnapshotNetWorth * percentageTime;
  // 70 = 50 + 20
  return prevSnapshot.value + relativNetworth;
};

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

export const formatSessionTimesNetWorthForChart = (
  snapshots: IApiSnapshot[],
  session: Session
): IDataChartSeries[] => {
  // Why this format: moment(new Date(s.created).getTime()).valueOf() ? Why not moment(s.created).valueOf()
  return snapshots
    .map((s) => ({
      x: moment(new Date(s.created).getTime()).valueOf(),
      y: +getValueForSnapshot(s).toFixed(2),
      id: s.uuid,
      events: {
        click: (e) => {
          if (session.chartPreviewSnapshotId !== e.point.id) {
            session.setSnapshotPreview(e.point.id);
          } else {
            session.setSnapshotPreview(undefined);
          }
        },
      },
      marker: {
        symbol: 'circle',
        radius: session.chartPreviewSnapshotId === s.uuid ? 5 : 1,
      },
      selected: session.chartPreviewSnapshotId === s.uuid,
    }))
    .sort((n1, n2) => n1.x - n2.x);
};

export const formatSessionTimesIncomeForChart = (
  snapshots: IApiSnapshot[],
  firstSnapshot: IApiSnapshot | undefined,
  session: Session
): IDataChartSeries[] => {
  // Why this format: moment(new Date(s.created).getTime()).valueOf() ? Why not moment(s.created).valueOf()
  return snapshots
    .map((s) => ({
      x: moment(new Date(s.created).getTime()).valueOf(),
      y: +calculateSessionIncome(s, firstSnapshot).toFixed(2),
      id: s.uuid,
      events: {
        click: (e) => {
          if (session.chartPreviewSnapshotId !== e.point.id) {
            session.setSnapshotPreview(e.point.id);
          } else {
            session.setSnapshotPreview(undefined);
          }
        },
      },
      marker: {
        symbol: 'circle',
        radius: session.chartPreviewSnapshotId === s.uuid ? 5 : 1,
      },
      selected: session.chartPreviewSnapshotId === s.uuid,
    }))
    .sort((n1, n2) => n1.x - n2.x);
};

export const mergeFromDiffSnapshotStashTabs = (
  snapshot1: IApiSnapshot,
  snapshot2: IApiSnapshot,
  updateSnapshot1Prices = true,
  removedItemsPriceResolver?: (items: IPricedItem[]) => void,
  addRemovedItems = false
): IApiSnapshot => {
  const itemToRemove = (itemsToRemove: IPricedItem[]) => {
    const difference: IPricedItem[] = [];
    const removedItems: IPricedItem[] = [];
    itemsToRemove.map((item) => {
      const recentItem = { ...item };
      if (recentItem.total !== 0 && recentItem.stackSize !== 0) {
        if (!addRemovedItems) {
          recentItem.total = -recentItem.total;
          recentItem.stackSize = -recentItem.stackSize;
        }

        if (removedItemsPriceResolver) removedItems.push(recentItem);
        difference.push(recentItem);
      }
    });
    if (removedItemsPriceResolver && removedItems.length > 0)
      removedItemsPriceResolver(removedItems);
    return difference;
  };

  const getDiffStashTabSnapshots = (
    stashTabs1: IApiStashTabSnapshot[],
    stashTabs2: IApiStashTabSnapshot[]
  ) => {
    return stashTabs2.map((stashTab2) => {
      const difference: IPricedItem[] = [];
      // const itemsToUpdate: IPricedItem[] = [];

      const itemInSnapshotTab2 = mergeItemStacks(stashTab2.pricedItems);
      const stashTab1 = stashTabs1.find(
        (stashTab1) => stashTab1.stashTabId === stashTab2.stashTabId
      );
      let itemInSnapshotTab1: IPricedItem[] = [];
      if (stashTab1) {
        itemInSnapshotTab1 = mergeItemStacks(stashTab1.pricedItems);
      }

      // items that exist in snapshot 2 but not in snapshot 1 & items that exist in both snapshots but should be updated
      const itemsToAddOrUpdate = itemInSnapshotTab2.filter((x) => {
        const foundItem = findItem(itemInSnapshotTab1, x);
        if (foundItem === undefined) return true;
        if (x.stackSize !== foundItem.stackSize) return true;
        return false;
      });

      itemsToAddOrUpdate.map((item) => {
        const recentItem = { ...item };
        const existingItem = findItem(itemInSnapshotTab1, recentItem);
        if (existingItem) {
          if (addRemovedItems) {
            recentItem.stackSize = recentItem.stackSize + existingItem.stackSize;
          } else {
            recentItem.stackSize = recentItem.stackSize - existingItem.stackSize;
          }
          if (updateSnapshot1Prices) {
            existingItem.total = recentItem.calculated * existingItem.stackSize;
            recentItem.total = recentItem.total - existingItem.total;
          } else {
            const existingItemTotal = recentItem.calculated * existingItem.stackSize;
            recentItem.total = recentItem.total - existingItemTotal;
          }
          if (recentItem.total !== 0 && recentItem.stackSize !== 0) {
            difference.push(recentItem);
          }
        } else if (recentItem.total !== 0 && recentItem.stackSize !== 0) {
          difference.push(recentItem);
        }
      });

      // Update by reference
      // if (priceResolver && itemsToUpdate.length > 0) priceResolver(itemsToUpdate);

      // items that exist in snapshot 1 but not in snapshot 2
      const itemsToRemove = itemInSnapshotTab1.filter(
        (x) => findItem(itemInSnapshotTab2, x) === undefined
      );
      const newDifference = difference.concat(itemToRemove(itemsToRemove));

      return {
        ...stashTab2,
        pricedItems: newDifference,
        value: getValueForSnapshotsItems(newDifference),
      } as IApiStashTabSnapshot;
    });
  };

  const getRemovedItemsFromStashTabs = (stashTabs: IApiStashTabSnapshot[]) => {
    return stashTabs.map((stashTab) => {
      const difference: IPricedItem[] = [];

      const itemsToRemove = mergeItemStacks(stashTab.pricedItems);
      const newDifference = difference.concat(itemToRemove(itemsToRemove));

      return {
        ...stashTab,
        pricedItems: newDifference,
        value: getValueForSnapshotsItems(newDifference),
      } as IApiStashTabSnapshot;
    });
  };

  // Snapshot2 stashtabs:
  const clonedDiffStashTabs2 = getDiffStashTabSnapshots(snapshot1.stashTabs, snapshot2.stashTabs);
  // Calculate stashtabs only in snapshot1 -> All items removed - Update them if needed
  const diffStashTabs1 = snapshot1.stashTabs.filter(
    (s1) => !snapshot2.stashTabs.some((s2) => s2.stashTabId === s1.stashTabId)
  );
  const clonedDiffStashTabs1 = getRemovedItemsFromStashTabs(diffStashTabs1);
  // Now combine the stashtabs into one snapshot
  return {
    ...snapshot2,
    stashTabs: clonedDiffStashTabs2.concat(clonedDiffStashTabs1),
  };
};

export const diffSnapshots = (
  snapshot1: IApiSnapshot,
  snapshot2: IApiSnapshot,
  updateSnapshot1Prices = true,
  removedItemsPriceResolver?: (items: IPricedItem[]) => void
) => {
  const difference: IPricedItem[] = [];
  const removedItems: IPricedItem[] = [];
  const itemsInSnapshot1 = mergeItemStacks(snapshot1.stashTabs.flatMap((sts) => sts.pricedItems));
  const itemsInSnapshot2 = mergeItemStacks(snapshot2.stashTabs.flatMap((sts) => sts.pricedItems));

  // items that exist in snapshot 2 but not in snapshot 1 & items that exist in both snapshots but should be updated
  const itemsToAddOrUpdate = itemsInSnapshot2.filter((x) => {
    const foundItem = findItem(itemsInSnapshot1, x);
    if (foundItem === undefined) return true;
    if (x.stackSize !== foundItem.stackSize) return true;
    return false;
  });

  itemsToAddOrUpdate.map((item) => {
    const recentItem = { ...item };
    const existingItem = findItem(itemsInSnapshot1, recentItem);
    if (existingItem) {
      recentItem.stackSize = recentItem.stackSize - existingItem.stackSize;
      if (updateSnapshot1Prices) {
        existingItem.total = recentItem.calculated * existingItem.stackSize;
        recentItem.total = recentItem.total - existingItem.total;
      } else {
        const existingItemTotal = recentItem.calculated * existingItem.stackSize;
        recentItem.total = recentItem.total - existingItemTotal;
      }
      if (recentItem.total !== 0 && recentItem.stackSize !== 0) {
        difference.push(recentItem);
      }
    } else if (recentItem.total !== 0 && recentItem.stackSize !== 0) {
      difference.push(recentItem);
    }
  });

  // items that exist in snapshot 1 but not in snapshot 2
  const itemsToRemove = itemsInSnapshot1.filter((x) => findItem(itemsInSnapshot2, x) === undefined);
  itemsToRemove.map((item) => {
    const recentItem = { ...item };
    if (recentItem.total !== 0 && recentItem.stackSize !== 0) {
      recentItem.total = -Math.abs(recentItem.total);
      recentItem.stackSize = -Math.abs(recentItem.stackSize);
      if (removedItemsPriceResolver) removedItems.push(recentItem);
      difference.push(recentItem);
    }
  });

  if (removedItemsPriceResolver && removedItems.length > 0) removedItemsPriceResolver(removedItems);

  return difference;
};

export const filterItems = (items: IPricedItem[], filterText: string) => {
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

export const filterSnapshotItems = (
  snapshots: IApiSnapshot[],
  filterText: string,
  filteredStashTabs: IStashTab[] | undefined
) => {
  if (snapshots.length === 0) {
    return [];
  }
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
            !filteredStashTabs || filteredStashTabs.map((fst) => fst.id).includes(st.stashTabId)
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

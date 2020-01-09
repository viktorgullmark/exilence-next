import { IPricedItem } from '../interfaces/api/api-priced-item.interface';
import { IApiSnapshot } from '../interfaces/api/api-snapshot.interface';
import { IApiStashTabSnapshot } from '../interfaces/api/api-stash-tab-snapshot.interface';
import { IApiStashTabPricedItem } from '../interfaces/api/api-stashtab-priceditem.interface';
import { IStashTab } from '../interfaces/stash.interface';
import { Snapshot } from '../store/domains/snapshot';
import { ColourUtils } from './colour.utils';
import { stores } from '..';
import { ItemUtils } from './item.utils';

export class SnapshotUtils {
  public static mapSnapshotToApiSnapshot(
    snapshot: Snapshot,
    stashTabs?: IStashTab[]
  ) {
    return <IApiSnapshot>{
      uuid: snapshot.uuid,
      datestamp: snapshot.datestamp,
      tabsFetchedCount: 0,
      stashTabs: stashTabs
        ? stashTabs
            .filter(st =>
              snapshot.stashTabSnapshots
                .map(sts => sts.stashTabId)
                .includes(st.id)
            )
            .map(st => {
              const foundTab = snapshot.stashTabSnapshots.find(
                sts => sts.stashTabId === st.id
              )!;

              return <IApiStashTabSnapshot>{
                uuid: foundTab.uuid,
                stashTabId: st.id,
                pricedItems: [],
                index: st.i,
                value: +foundTab.value.toFixed(4),
                color: ColourUtils.rgbToHex(
                  st.colour.r,
                  st.colour.g,
                  st.colour.b
                ),
                name: st.n
              };
            })
        : snapshot.stashTabSnapshots
    };
  }

  public static mapSnapshotsToStashTabPricedItems(
    snapshot: Snapshot,
    stashTabs: IStashTab[]
  ) {
    return stashTabs
      .filter(st =>
        snapshot.stashTabSnapshots.map(sts => sts.stashTabId).includes(st.id)
      )
      .map(st => {
        const foundTab = snapshot.stashTabSnapshots.find(
          sts => sts.stashTabId === st.id
        )!;

        return <IApiStashTabPricedItem>{
          uuid: foundTab.uuid,
          stashTabId: st.id,
          pricedItems: foundTab.pricedItems.map(i => {
            return <IPricedItem>{ ...i, uuid: i.uuid, itemId: i.itemId };
          })
        };
      });
  }

  public static calculateNetWorth(snapshots: IApiSnapshot[]) {
    // todo: test calculation, might be wrong with first flatmap
    const values = snapshots
      .flatMap(sts => sts.stashTabs)
      .flatMap(sts => sts.pricedItems)
      .flatMap(item => item.total)
      .filter(value => value >= stores.settingStore.priceTreshold)
      .reduce((a, b) => a + b, 0);

    return values.toLocaleString(undefined, { maximumFractionDigits: 2 });
  }

  public static filterItems(snapshots: IApiSnapshot[]) {
    if (snapshots.length === 0) {
      return [];
    }
    const mergedItems = ItemUtils.mergeItemStacks(
      snapshots
        .flatMap(sts => sts.stashTabs)
        .flatMap(sts =>
          sts.pricedItems.filter(
            i =>
              i.calculated > 0 &&
              i.name
                .toLowerCase()
                .includes(stores.uiStateStore.itemTableFilterText.toLowerCase())
          )
        )
    );

    return mergedItems.filter(
      mi => mi.total >= stores.settingStore.priceTreshold
    );
  }

  public static getItemCount(snapshots: IApiSnapshot[]) {
    return ItemUtils.mergeItemStacks(
      snapshots
        .flatMap(sts => sts.stashTabs)
        .flatMap(sts => sts.pricedItems.filter(i => i.calculated > 0))
    ).length;
  }
}

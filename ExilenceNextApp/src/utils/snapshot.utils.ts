import { IApiPricedItem } from '../interfaces/api/api-priced-item.interface';
import { IApiSnapshot } from '../interfaces/api/api-snapshot.interface';
import { IApiStashTabSnapshot } from '../interfaces/api/api-stash-tab-snapshot.interface';
import { IApiStashTabPricedItem } from '../interfaces/api/api-stashtab-priceditem.interface';
import { IStashTab } from '../interfaces/stash.interface';
import { Snapshot } from '../store/domains/snapshot';
import { ColourUtils } from './colour.utils';

export class SnapshotUtils {
  public static mapSnapshotToApiSnapshot(
    snapshot: Snapshot,
    stashTabs: IStashTab[]
  ) {
    return <IApiSnapshot>{
      uuid: snapshot.uuid,
      datestamp: snapshot.datestamp,
      tabsFetchedCount: 0,
      stashTabs: stashTabs
        .filter(st =>
          snapshot.stashTabSnapshots.map(sts => sts.stashTabId).includes(st.id)
        )
        .map(st => {
          const foundTab = snapshot.stashTabSnapshots
          .find(sts => sts.stashTabId === st.id)!;

          return <IApiStashTabSnapshot>{
            uuid: foundTab.uuid,
            stashTabId: st.id,
            pricedItems: [],
            index: st.i,
            value: +foundTab
              .value.toFixed(4),
            color: ColourUtils.rgbToHex(st.colour.r, st.colour.g, st.colour.b),
            name: st.n
          };
        })
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
          pricedItems: foundTab.items.map(i => {
            return <IApiPricedItem>{ ...i, uuid: i.id, id: null };
          })
        };
      });
  }
}

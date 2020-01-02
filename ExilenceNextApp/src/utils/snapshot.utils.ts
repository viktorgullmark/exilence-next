import { Snapshot } from '../store/domains/snapshot';
import { StashTab } from '../store/domains/stash-tab';
import { IApiSnapshot } from '../interfaces/api/api-snapshot.interface';
import { IStashTab } from '../interfaces/stash.interface';
import { IApiStashTabSnapshot } from '../interfaces/api/api-stash-tab-snapshot.interface';
import { ColourUtils } from './colour.utils';
import { IApiPricedItem } from '../interfaces/api/api-priced-item.interface';
import uuid from 'uuid';
import { IApiStashTabPricedItem } from '../interfaces/api/api-stashtab-priceditem.interface';

export class SnapshotUtils {
  public static mapSnapshotToApiSnapshot(
    snapshot: Snapshot,
    stashTabs: IStashTab[]
  ) {
    return <IApiSnapshot>{
      uuid: snapshot.uuid,
      datestamp: snapshot.datestamp,
      stashTabs: stashTabs
        .filter(st =>
          snapshot.stashTabSnapshots.map(sts => sts.stashTabId).includes(st.id)
        )
        .map(st => {
          return <IApiStashTabSnapshot>{
            uuid: st.id,
            pricedItems: [],
            index: st.i,
            value: +snapshot.stashTabSnapshots
              .find(sts => sts.stashTabId === st.id)!
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
        return <IApiStashTabPricedItem>{
          stashTabId: st.id,
          pricedItems: snapshot.stashTabSnapshots
            .find(sts => sts.stashTabId === st.id)!
            .items.map(i => {
              return <IApiPricedItem>{ ...i, uuid: i.id, id: null };
            })
        };
      });
  }
}

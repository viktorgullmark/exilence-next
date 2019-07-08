import { Snapshot } from '../interfaces/snapshot.interface';
import { CompactTab, Tab } from '../interfaces/stash.interface';
import { PricedItem } from '../interfaces/priced-item.interface';
import { TableItem } from '../interfaces/table-item.interface';

export class TableHelper {
    public static formatTabsForTable(tabs: Tab[]): TableItem[] {
        const itemsForTable = [];
        tabs.forEach((tab: Tab) => {
            tab.items.forEach((item: PricedItem) => {

                // todo: combine stacks and use .join(', ');

                itemsForTable.push({
                    name: item.name,
                    frameType: item.frameType,
                    total: item.calculated,
                    calculated: item.calculated,
                    max: item.max,
                    mean: item.mean,
                    median: item.median,
                    min: item.min,
                    mode: item.mode,
                    stackSize: item.stackSize,
                    totalStacksize: item.totalStacksize,
                    links: item.links,
                    quality: item.quality,
                    level: item.level,
                    corrupted: item.corrupted,
                    icon: item.icon,
                    sockets: item.sockets,
                    tabNames: tab.n
                } as TableItem);
            });
        });


        return itemsForTable;
    }
}

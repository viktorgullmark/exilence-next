import { Snapshot } from '../interfaces/snapshot.interface';
import { CompactTab, Tab } from '../interfaces/stash.interface';
import { PricedItem } from '../interfaces/priced-item.interface';
import { TableItem } from '../interfaces/table-item.interface';

export class TableHelper {
    public static formatTabsForTable(tabs: Tab[]): TableItem[] {
        const itemsForTable: TableItem[] = [];
        tabs.forEach((tab: Tab) => {
            for (let i = 0; i < tab.items.length; i++) {
                const pItem = tab.items[i];
                const item = {
                    name: pItem.name,
                    frameType: pItem.frameType,
                    total: pItem.calculated * pItem.stackSize,
                    calculated: pItem.calculated,
                    max: pItem.max,
                    mean: pItem.mean,
                    median: pItem.median,
                    min: pItem.min,
                    mode: pItem.mode,
                    stackSize: pItem.stackSize,
                    totalStacksize: pItem.totalStacksize,
                    links: pItem.links,
                    quality: pItem.quality,
                    level: pItem.level,
                    corrupted: pItem.corrupted,
                    icon: pItem.icon,
                    sockets: pItem.sockets,
                    tabs: [{ i: tab.i, id: tab.id, colour: tab.colour, n: tab.n } as CompactTab]
                } as TableItem;

                const foundStackIndex = itemsForTable.indexOf(TableHelper.findTableItem(itemsForTable, item));
                if (item.calculated > 0) {
                    if (foundStackIndex === -1) {
                        itemsForTable.push(item);
                    } else {
                        itemsForTable[foundStackIndex].stackSize += item.stackSize;
                        itemsForTable[foundStackIndex].total = itemsForTable[foundStackIndex].stackSize * item.calculated;

                        if (itemsForTable[foundStackIndex].tabs.find(t => t.id === tab.id) === undefined) {
                            itemsForTable[foundStackIndex].tabs.push({ i: tab.i, id: tab.id, colour: tab.colour, n: tab.n } as CompactTab);
                        }
                    }
                }
            }
        });

        return itemsForTable;
    }

    public static getTabNames(tabs: CompactTab[]) {
        const tabNames = tabs.map(tab => {
            return tab.n;
        });

        return tabNames.join(', ');
    }

    public static findTableItem(array: TableItem[], itemToFind: TableItem) {
        return array.find(x =>
            x.name === itemToFind.name
            && x.quality === itemToFind.quality
            && x.links === itemToFind.links
            && x.level === itemToFind.level
            && x.corrupted === itemToFind.corrupted
            // ignore frameType for all maps except unique ones
            && (x.frameType === itemToFind.frameType || (x.name.indexOf(' Map') > -1 && x.frameType !== 3))
        );
    }
}

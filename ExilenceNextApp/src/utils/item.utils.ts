import { Rarity } from '../assets/themes/exilence-theme';
import { IPricedItem } from '../interfaces/priced-item.interface';
import { IProperty } from '../interfaces/property.interface';
import { ISocket } from '../interfaces/socket.interface';
import { IStashTabSnapshot } from '../interfaces/stash-tab-snapshot.interface';

export interface IMergedItem extends IPricedItem {
  total: number;
}

export class ItemUtils {
  public static mergeItemStacks(items: IPricedItem[]) {
    const mergedItems: IPricedItem[] = [];

    items.forEach(item => {
      const clonedItem = { ...item };
      const foundItem = this.findItem(mergedItems, clonedItem);

      if (!foundItem) {
        mergedItems.push(clonedItem);
      } else {
        const foundStackIndex = mergedItems.indexOf(foundItem);
        mergedItems[foundStackIndex].stackSize += item.stackSize;
        mergedItems[foundStackIndex].total =
          mergedItems[foundStackIndex].stackSize *
          mergedItems[foundStackIndex].calculated;
      }
    });

    return mergedItems;
  }

  public static formatSnapshotsForTable(
    stashTabSnapshots: IStashTabSnapshot[]
  ) {
    let mergedStashTabs: IPricedItem[] = [];

    stashTabSnapshots.forEach(snapshot => {
      mergedStashTabs = mergedStashTabs.concat(snapshot.pricedItems);
    });

    return this.mergeItemStacks(mergedStashTabs);
  }

  public static findItem<T extends IPricedItem>(array: T[], itemToFind: T) {
    return array.find(
      x =>
        x.name === itemToFind.name &&
        x.quality === itemToFind.quality &&
        x.links === itemToFind.links &&
        x.level === itemToFind.level &&
        x.corrupted === itemToFind.corrupted &&
        // ignore frameType for all maps except unique ones
        (x.frameType === itemToFind.frameType ||
          (x.name.indexOf(' Map') > -1 && x.frameType !== 3))
    );
  }
  public static isDivinationCard(icon: string) {
    return icon.indexOf('/Divination/') > -1;
  }
  public static getLinks(array: any[]) {
    const numMapping: any = {};
    let greatestFreq = 0;
    array.forEach(function findMode(number) {
      numMapping[number] = (numMapping[number] || 0) + 1;

      if (greatestFreq < numMapping[number]) {
        greatestFreq = numMapping[number];
      }
    });
    return greatestFreq;
  }

  public static getRarity(identifier: number) {
    let rarity: keyof Rarity = 'normal';
    switch (identifier) {
      case 0:
        rarity = 'normal';
        break;
      case 1:
        rarity = 'magic';
        break;
      case 2:
        rarity = 'rare';
        break;
      case 3:
        rarity = 'unique';
        break;
      case 4:
        rarity = 'gem';
        break;
      case 5:
        rarity = 'currency';
        break;
      case 6:
        rarity = 'divination';
        break;
      case 7:
        rarity = 'quest';
        break;
      default:
        break;
    }

    return rarity;
  }

  public static getQuality(props: IProperty[]) {
    const quality = props.find(t => t.name === 'Quality')
      ? props.find(t => t.name === 'Quality')!.values[0][0]
      : '0';
    return parseInt(quality, 10);
  }

  public static getLevel(props: IProperty[]) {
    const levelProp = props.find(p => p.name === 'Level');
    if (!levelProp) {
      return 0;
    } else {
      const levelStr = levelProp.values[0][0];
      return parseInt(levelStr, 10);
    }
  }

  public static getMapTier(properties: IProperty[]) {
    for (let i = 0; i < properties.length; i++) {
      const prop = properties[i];
      if (prop.name === 'Map Tier') {
        return +prop.values[0][0];
      }
    }
    return 0;
  }

  public static getItemName(typeline: string, name: string) {
    let itemName = name;
    if (typeline) {
      itemName += ' ' + typeline;
    }
    return itemName.replace('<<set:MS>><<set:M>><<set:S>>', '').trim();
  }

  public static getItemVariant(
    sockets: ISocket[],
    explicitMods: string[],
    name: string
  ): string {

    if (name === 'Impresence') {
      if (explicitMods.filter(s => s.includes('Lightning Damage'))) {
        return 'Lightning';
      }
      if (explicitMods.filter(s => s.includes('Fire Damage'))) {
        return 'Fire';
      }
      if (explicitMods.filter(s => s.includes('Cold Damage'))) {
        return 'Cold';
      }
      if (explicitMods.filter(s => s.includes('Physical Damage'))) {
        return 'Physical';
      }
      if (explicitMods.filter(s => s.includes('Chaos Damage'))) {
        return 'Chaos';
      }
    }

    // Abyssal
    if (name === 'Lightpoacher') {
      const count = sockets.filter(x => x.sColour === 'A' || x.sColour === 'a')
        .length;
      return count === 1 ? count + ' Jewel' : count + ' Jewels';
    }
    if (name === 'Shroud of the Lightless') {
      const count = sockets.filter(x => x.sColour === 'A' || x.sColour === 'a')
        .length;
      return count === 1 ? count + ' Jewel' : count + ' Jewels';
    }
    if (name === 'Bubonic Trail') {
      const count = sockets.filter(x => x.sColour === 'A' || x.sColour === 'a')
        .length;
      return count === 1 ? count + ' Jewel' : count + ' Jewels';
    }
    if (name === 'Tombfist') {
      const count = sockets.filter(x => x.sColour === 'A' || x.sColour === 'a')
        .length;
      return count === 1 ? count + ' Jewel' : count + ' Jewels';
    }
    if (name === 'Hale Negator') {
      const count = sockets.filter(x => x.sColour === 'A' || x.sColour === 'a')
        .length;
      return count === 1 ? count + ' Jewel' : count + ' Jewels';
    }
    if (name === 'Command of the Pit') {
      const count = sockets.filter(x => x.sColour === 'A' || x.sColour === 'a')
        .length;
      return count === 1 ? count + ' Jewel' : count + ' Jewels';
    }

    return '';
  }
}

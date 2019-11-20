import { IProperty } from "../interfaces/property.interface";
import { ISocket } from "../interfaces/socket.interface";
import { IPricedItem } from "../interfaces/priced-item.interface";
import { IStashTabSnapshot } from '../interfaces/stash-tab-snapshot.interface';

export class ItemHelper {
  public static mergeItemStacks(items: IPricedItem[]) {
    const mergedItems: IPricedItem[] = [];

    items.forEach(item => {
      const foundItem = this.findItem(mergedItems, item);

      if (!foundItem) {
        mergedItems.push(item);
      } else {
        const foundStackIndex = mergedItems.indexOf(foundItem);
        mergedItems[foundStackIndex].stackSize += item.stackSize;
      }
    });

    return mergedItems;
  }

  public static formatSnapshotsForTable(stashTabSnapshots: IStashTabSnapshot[]) {
    let mergedStashTabs: IPricedItem[] = [];

    stashTabSnapshots.forEach(snapshot => {
      mergedStashTabs = mergedStashTabs.concat(snapshot.items);
    });

    return this.mergeItemStacks(mergedStashTabs);
  }

  public static findItem(array: IPricedItem[], itemToFind: IPricedItem) {
    return array.find(
      x =>
        x.name === itemToFind.name &&
        x.quality === itemToFind.quality &&
        x.links === itemToFind.links &&
        x.level === itemToFind.level &&
        x.corrupted === itemToFind.corrupted &&
        // ignore frameType for all maps except unique ones
        (x.frameType === itemToFind.frameType ||
          (x.name.indexOf(" Map") > -1 && x.frameType !== 3))
    );
  }
  public static isDivinationCard(icon: string) {
    return icon.indexOf("/Divination/") > -1;
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

  public static getQuality(props: IProperty[]) {
    const quality = props.find(t => t.name === "Quality")
      ? props.find(t => t.name === "Quality")!.values[0][0]
      : "0";
    return parseInt(quality, 10);
  }

  public static getLevel(props: IProperty[]) {
    const levelStr = props.find(p => p.name === "Level")!.values[0][0];
    return parseInt(levelStr, 10);
  }

  public static getMapTier(properties: IProperty[]) {
    for (let i = 0; i < properties.length; i++) {
      const prop = properties[i];
      if (prop.name === "Map Tier") {
        return +prop.values[0][0];
      }
    }
    return 0;
  }

  public static getItemName(typeline: string, name: string) {
    let itemName = name;
    if (typeline) {
      itemName += " " + typeline;
    }
    return itemName.replace("<<set:MS>><<set:M>><<set:S>>", "").trim();
  }

  public static getItemVariant(
    sockets: ISocket[],
    explicitMods: string[],
    name: string
  ): string {
    if (sockets === null || sockets === undefined) {
      return "";
    }

    if (name === "Impresence") {
      if (explicitMods.filter(s => s.includes("Lightning Damage"))) {
        return "Lightning";
      }
      if (explicitMods.filter(s => s.includes("Fire Damage"))) {
        return "Fire";
      }
      if (explicitMods.filter(s => s.includes("Cold Damage"))) {
        return "Cold";
      }
      if (explicitMods.filter(s => s.includes("Physical Damage"))) {
        return "Physical";
      }
      if (explicitMods.filter(s => s.includes("Chaos Damage"))) {
        return "Chaos";
      }
    }

    // Abyssal
    if (name === "Lightpoacher") {
      const count = sockets.filter(x => x.sColour === "A" || x.sColour === "a")
        .length;
      return count === 1 ? count + " Jewel" : count + " Jewels";
    }
    if (name === "Shroud of the Lightless") {
      const count = sockets.filter(x => x.sColour === "A" || x.sColour === "a")
        .length;
      return count === 1 ? count + " Jewel" : count + " Jewels";
    }
    if (name === "Bubonic Trail") {
      const count = sockets.filter(x => x.sColour === "A" || x.sColour === "a")
        .length;
      return count === 1 ? count + " Jewel" : count + " Jewels";
    }
    if (name === "Tombfist") {
      const count = sockets.filter(x => x.sColour === "A" || x.sColour === "a")
        .length;
      return count === 1 ? count + " Jewel" : count + " Jewels";
    }
    if (name === "Hale Negator") {
      const count = sockets.filter(x => x.sColour === "A" || x.sColour === "a")
        .length;
      return count === 1 ? count + " Jewel" : count + " Jewels";
    }
    if (name === "Command of the Pit") {
      const count = sockets.filter(x => x.sColour === "A" || x.sColour === "a")
        .length;
      return count === 1 ? count + " Jewel" : count + " Jewels";
    }

    return "";
  }
}

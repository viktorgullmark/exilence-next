import { v4 as uuidv4 } from 'uuid';

import { Rarity } from '../assets/themes/exilence-theme';
import { IItem } from '../interfaces/item.interface';
import { IPricedItem } from '../interfaces/priced-item.interface';
import { IProperty } from '../interfaces/property.interface';
import { ISocket } from '../interfaces/socket.interface';
import { IStashTabSnapshot } from '../interfaces/stash-tab-snapshot.interface';
import { ICompactTab, IStashTab } from '../interfaces/stash.interface';

export function mergeItemStacks(items: IPricedItem[]) {
  const mergedItems: IPricedItem[] = [];

  items.forEach((item) => {
    const clonedItem = { ...item };
    const foundItem = findItem(mergedItems, clonedItem);

    if (!foundItem) {
      mergedItems.push(clonedItem);
    } else {
      const foundStackIndex = mergedItems.indexOf(foundItem);
      mergedItems[foundStackIndex].stackSize += item.stackSize;
      mergedItems[foundStackIndex].total =
        mergedItems[foundStackIndex].stackSize * mergedItems[foundStackIndex].calculated;
      if (mergedItems[foundStackIndex].tab !== undefined && item.tab !== undefined) {
        mergedItems[foundStackIndex].tab = [...mergedItems[foundStackIndex].tab, ...item.tab];
        mergedItems[foundStackIndex].tab = mergedItems[foundStackIndex].tab.filter(
          (v, i, a) => a.findIndex((t) => t.id === v.id) === i
        );
      }
    }
  });

  return mergedItems;
}

export function formatSnapshotsForTable(stashTabSnapshots: IStashTabSnapshot[]) {
  let mergedStashTabs: IPricedItem[] = [];

  stashTabSnapshots.forEach((snapshot) => {
    mergedStashTabs = mergedStashTabs.concat(snapshot.pricedItems);
  });

  return mergeItemStacks(mergedStashTabs);
}

export function parseTabNames(tabs: ICompactTab[]) {
  return tabs.map((t) => t.name).join(', ');
}

export function mapItemsToPricedItems(items: IItem[], tab?: IStashTab) {
  return items.map((item: IItem) => {
    const mapTier =
      item.properties !== null && item.properties !== undefined ? getMapTier(item.properties) : 0;
    const blighted = item.typeLine.indexOf('Blighted ') > -1;
    const mappedItem = {
      uuid: uuidv4(),
      itemId: item.id,
      name:
        mapTier && item.frameType !== 3
          ? item.baseType
          : getItemName(item.name, item.frameType !== 3 ? item.typeLine : undefined),
      typeLine: item.typeLine,
      frameType: item.frameType,
      calculated: 0,
      inventoryId: item.inventoryId,
      elder: (item.elder !== undefined ? item.elder : false) || isElderMap(item.implicitMods),
      shaper: (item.shaper !== undefined ? item.shaper : false) || isShaperMap(item.implicitMods),
      blighted: blighted,
      icon: item.icon,
      ilvl:
        item.typeLine.indexOf(' Seed') > -1 && item.frameType === 5
          ? getSeedTier(item.properties)
          : item.ilvl,
      tier: mapTier,
      corrupted: item.corrupted || false,
      links:
        item.sockets !== undefined && item.sockets !== null
          ? getLinks(item.sockets.map((t) => t.group))
          : 0,
      sockets: item.sockets !== undefined && item.sockets !== null ? item.sockets.length : 0,
      quality:
        item.properties !== null && item.properties !== undefined ? getQuality(item.properties) : 0,
      level:
        item.properties !== null && item.properties !== undefined ? getLevel(item.properties) : 0,
      stackSize: item.stackSize || 1,
      totalStacksize: item.maxStackSize || 1,
      variant: getItemVariant(
        item.sockets,
        item.explicitMods,
        getItemName(item.name, item.typeLine)
      ),
      tab: tab
        ? [
            {
              name: tab.name,
              index: tab.index,
              id: tab.id,
              color: tab.metadata.colour,
            } as ICompactTab,
          ]
        : [],
    } as IPricedItem;
    return mappedItem;
  });
}

export function findItem<T extends IPricedItem>(array: T[], itemToFind: T) {
  return array.find(
    (x) =>
      x.name === itemToFind.name &&
      (x.typeLine.indexOf(' Map') > -1 || x.quality === itemToFind.quality) &&
      x.links === itemToFind.links &&
      x.level === itemToFind.level &&
      x.corrupted === itemToFind.corrupted &&
      (x.typeLine.indexOf(' Seed') === -1 ||
        x.typeLine.indexOf(' Map') > -1 ||
        x.ilvl === itemToFind.ilvl) &&
      // ignore frameType for all maps except unique ones
      (x.frameType === itemToFind.frameType || (x.name.indexOf(' Map') > -1 && x.frameType !== 3))
  );
}

export function isDivinationCard(icon: string) {
  return icon.indexOf('/Divination/') > -1;
}

export function isSpecialGem(name: string) {
  const suffix = 'Support';
  const specialGems = [`Empower ${suffix}`, `Enhance ${suffix}`, `Enlighten ${suffix}`];
  return specialGems.some((sg) => name.includes(sg));
}

export function getLinks(array: any[]) {
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

const rarities: (keyof Rarity)[] = [
  'normal', //0
  'magic', //1
  'rare', //2
  'unique', //3
  'gem', //4
  'currency', //5
  'divination', //6
  'quest', //7
  'unknown', //8
  'legacy', //9
];

export function getRarity(identifier: number): keyof Rarity {
  if (identifier < rarities.length) {
    return rarities[identifier];
  } else {
    return rarities[0];
  }
}

export function getRarityIdentifier(name: string): number {
  return rarities.indexOf(name as keyof Rarity);
}

export function getQuality(props: IProperty[]) {
  const quality = props.find((t) => t.name === 'Quality')
    ? props.find((t) => t.name === 'Quality')!.values[0][0]
    : '0';
  return parseInt(quality, 10);
}

export function getSeedTier(props: IProperty[]) {
  const seedTier = props.find((t) => t.name.indexOf('Spawns a Level') > -1)
    ? props.find((t) => t.name.indexOf('Spawns a Level') > -1)!.values[0][0]
    : '0';
  return parseInt(seedTier, 10);
}

export function getLevel(props: IProperty[]) {
  const levelProp = props.find((p) => p.name === 'Level');
  if (!levelProp) {
    return 0;
  } else {
    const levelStr = levelProp.values[0][0];
    return parseInt(levelStr, 10);
  }
}

export function getMapTier(properties: IProperty[]) {
  for (let i = 0; i < properties.length; i++) {
    const prop = properties[i];
    if (prop.name === 'Map Tier') {
      return +prop.values[0][0];
    }
  }
  return 0;
}

export function getItemName(name: string, typeline?: string) {
  let itemName = name;
  if (typeline) {
    itemName += ' ' + typeline;
  }
  return itemName.replace('<<set:MS>><<set:M>><<set:S>>', '').trim();
}

export function isElderMap(implicitMods: string[]): boolean {
  if (implicitMods) {
    return implicitMods.some((im) => im.includes('Elder'));
  }
  return false;
}

export function isShaperMap(implicitMods: string[]): boolean {
  if (implicitMods) {
    return implicitMods.some((im) => im.includes('Shaper'));
  }
  return false;
}

export function getItemVariant(sockets: ISocket[], explicitMods: string[], name: string): string {
  if (explicitMods) {
    const watchStoneUsesMod = explicitMods.find((em) => em.includes('uses remaining'));
    if (watchStoneUsesMod) {
      return watchStoneUsesMod.split(' ')[0];
    }
  }

  if (name === 'Impresence') {
    if (explicitMods.filter((s) => s.includes('Lightning Damage'))) {
      return 'Lightning';
    }
    if (explicitMods.filter((s) => s.includes('Fire Damage'))) {
      return 'Fire';
    }
    if (explicitMods.filter((s) => s.includes('Cold Damage'))) {
      return 'Cold';
    }
    if (explicitMods.filter((s) => s.includes('Physical Damage'))) {
      return 'Physical';
    }
    if (explicitMods.filter((s) => s.includes('Chaos Damage'))) {
      return 'Chaos';
    }
  }

  // Abyssal
  if (name === 'Lightpoacher') {
    const count = sockets.filter((x) => x.sColour === 'A' || x.sColour === 'a').length;
    return count === 1 ? count + ' Jewel' : count + ' Jewels';
  }
  if (name === 'Shroud of the Lightless') {
    const count = sockets.filter((x) => x.sColour === 'A' || x.sColour === 'a').length;
    return count === 1 ? count + ' Jewel' : count + ' Jewels';
  }
  if (name === 'Bubonic Trail') {
    const count = sockets.filter((x) => x.sColour === 'A' || x.sColour === 'a').length;
    return count === 1 ? count + ' Jewel' : count + ' Jewels';
  }
  if (name === 'Tombfist') {
    const count = sockets.filter((x) => x.sColour === 'A' || x.sColour === 'a').length;
    return count === 1 ? count + ' Jewel' : count + ' Jewels';
  }
  if (name === 'Hale Negator') {
    const count = sockets.filter((x) => x.sColour === 'A' || x.sColour === 'a').length;
    return count === 1 ? count + ' Jewel' : count + ' Jewels';
  }
  if (name === 'Command of the Pit') {
    const count = sockets.filter((x) => x.sColour === 'A' || x.sColour === 'a').length;
    return count === 1 ? count + ' Jewel' : count + ' Jewels';
  }

  return '';
}

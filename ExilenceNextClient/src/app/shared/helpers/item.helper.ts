import { Item } from "../interfaces/item.interface";
import { Property } from "../interfaces/property.interface";

export class ItemHelper {
    public static isDivinationCard(icon: string) {
        return icon.indexOf('/Divination/') > -1;
    }
    public static getLinks(array: any[]) {
        const numMapping = {};
        let greatestFreq = 0;
        array.forEach(function findMode(number) {
            numMapping[number] = (numMapping[number] || 0) + 1;

            if (greatestFreq < numMapping[number]) {
                greatestFreq = numMapping[number];
            }
        });
        return greatestFreq;
    }

    public static getQuality(props: Property[]) {
        const quality =
        props.find(t => t.name === 'Quality') ?
        props.find(t => t.name === 'Quality').values[0][0] : '0';
        return parseInt(quality, 10);
    }

    public static getLevel(props: Property[]) {
        const levelStr = props.find(p => p.name === 'Level').values[0][0];
        return parseInt(levelStr, 10);
    }

    public static getMapTier(properties: Property[]) {
        for (let i = 0; i < properties.length; i++) {
            const prop = properties[i];
            if (prop.name === 'Map Tier') {
                return +prop.values[0][0];
            }
        }
        return 0;
    }

    public static getItemVariant(item: Item): string {
        if (item.sockets === null || item.sockets === undefined) {
            return '';
        }

        if (item.name === 'Impresence') {
            if (item.explicitMods.filter(s => s.includes('Lightning Damage'))) { return 'Lightning'; }
            if (item.explicitMods.filter(s => s.includes('Fire Damage'))) { return 'Fire'; }
            if (item.explicitMods.filter(s => s.includes('Cold Damage'))) { return 'Cold'; }
            if (item.explicitMods.filter(s => s.includes('Physical Damage'))) { return 'Physical'; }
            if (item.explicitMods.filter(s => s.includes('Chaos Damage'))) { return 'Chaos'; }
        }

        // Abyssal
        if (item.name === 'Lightpoacher') {
            const count = item.sockets.filter(x => x.sColour === 'A' || x.sColour === 'a').length;
            return count === 1 ? count + ' Jewel' : count + ' Jewels';
        }
        if (item.name === 'Shroud of the Lightless') {
            const count = item.sockets.filter(x => x.sColour === 'A' || x.sColour === 'a').length;
            return count === 1 ? count + ' Jewel' : count + ' Jewels';
        }
        if (item.name === 'Bubonic Trail') {
            const count = item.sockets.filter(x => x.sColour === 'A' || x.sColour === 'a').length;
            return count === 1 ? count + ' Jewel' : count + ' Jewels';
        }
        if (item.name === 'Tombfist') {
            const count = item.sockets.filter(x => x.sColour === 'A' || x.sColour === 'a').length;
            return count === 1 ? count + ' Jewel' : count + ' Jewels';
        }
        if (item.name === 'Hale Negator') {
            const count = item.sockets.filter(x => x.sColour === 'A' || x.sColour === 'a').length;
            return count === 1 ? count + ' Jewel' : count + ' Jewels';
        }
        if (item.name === 'Command of the Pit') {
            const count = item.sockets.filter(x => x.sColour === 'A' || x.sColour === 'a').length;
            return count === 1 ? count + ' Jewel' : count + ' Jewels';
        }

        return '';
    }
}

import { Item } from "../interfaces/item.interface";
import { Property } from "../interfaces/property.interface";
import { Socket } from "../interfaces/socket.interface";

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

    public static getItemName(typeline: string, name: string) {
        let itemName = name;
        if (typeline) {
            itemName += ' ' + typeline;
        }
        return itemName.replace('<<set:MS>><<set:M>><<set:S>>', '').trim();
    }

    public static getItemVariant(sockets: Socket[], explicitMods: string[]): string {
        if (sockets === null ||sockets === undefined) {
            return '';
        }

        if (name === 'Impresence') {
            if (explicitMods.filter(s => s.includes('Lightning Damage'))) { return 'Lightning'; }
            if (explicitMods.filter(s => s.includes('Fire Damage'))) { return 'Fire'; }
            if (explicitMods.filter(s => s.includes('Cold Damage'))) { return 'Cold'; }
            if (explicitMods.filter(s => s.includes('Physical Damage'))) { return 'Physical'; }
            if (explicitMods.filter(s => s.includes('Chaos Damage'))) { return 'Chaos'; }
        }

        // Abyssal
        if (name === 'Lightpoacher') {
            const count = sockets.filter(x => x.sColour === 'A' || x.sColour === 'a').length;
            return count === 1 ? count + ' Jewel' : count + ' Jewels';
        }
        if (name === 'Shroud of the Lightless') {
            const count = sockets.filter(x => x.sColour === 'A' || x.sColour === 'a').length;
            return count === 1 ? count + ' Jewel' : count + ' Jewels';
        }
        if (name === 'Bubonic Trail') {
            const count = sockets.filter(x => x.sColour === 'A' || x.sColour === 'a').length;
            return count === 1 ? count + ' Jewel' : count + ' Jewels';
        }
        if (name === 'Tombfist') {
            const count = sockets.filter(x => x.sColour === 'A' || x.sColour === 'a').length;
            return count === 1 ? count + ' Jewel' : count + ' Jewels';
        }
        if (name === 'Hale Negator') {
            const count = sockets.filter(x => x.sColour === 'A' || x.sColour === 'a').length;
            return count === 1 ? count + ' Jewel' : count + ' Jewels';
        }
        if (name === 'Command of the Pit') {
            const count = sockets.filter(x => x.sColour === 'A' || x.sColour === 'a').length;
            return count === 1 ? count + ' Jewel' : count + ' Jewels';
        }

        return '';
    }
}

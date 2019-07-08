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
}

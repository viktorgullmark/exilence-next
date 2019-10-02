import { Item } from './item.interface';
import { PricedItem } from './priced-item.interface';

export interface Stash {
    numTabs: number;
    tabs: Tab[];
    items: Item[];
    mapLayout: any;
    [x: string]: any;
}

export interface Tab {
    n: string;
    i: number;
    id: string;
    type: string;
    hidden: boolean;
    selected: boolean;
    colour: Colour;
    srcL: string;
    srcC: string;
    srcR: string;
    league: string;
    items: PricedItem[];
}

export interface CompactTab {
    n: string;
    i: number;
    id: string;
    colour: Colour;
}

export interface Colour {
    r: number;
    g: number;
    b: number;
}

import { IItem } from './item.interface';
import { IPricedItem } from './priced-item.interface';

export interface IStash {
    numTabs: number;
    tabs: ITab[];
    items: IItem[];
    mapLayout: any;
    [x: string]: any;
}

export interface ITab {
    n: string;
    i: number;
    id: string;
    type: string;
    hidden: boolean;
    selected: boolean;
    colour: IColour;
    srcL: string;
    srcC: string;
    srcR: string;
    league: string;
    items: IPricedItem[];
}

export interface ICompactTab {
    n: string;
    i: number;
    id: string;
    colour: IColour;
}

export interface IColour {
    r: number;
    g: number;
    b: number;
}

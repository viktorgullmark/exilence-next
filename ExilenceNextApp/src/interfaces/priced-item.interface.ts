import { IExternalPrice } from './external-price.interface';

export interface IPricedItem {
    id: string;
    name: string;
    typeLine: string;
    frameType: number;
    calculated: number;
    max?: number;
    elder: boolean;
    shaper: boolean;
    mean?: number;
    median?: number;
    min?: number;
    mode?: number;
    ilvl: number;
    stackSize: number;
    totalStacksize: number;
    links: number;
    quality: number;
    level: number;
    corrupted: boolean;
    icon: string;
    sockets: number;
    variant: string;
    tier: number;
}


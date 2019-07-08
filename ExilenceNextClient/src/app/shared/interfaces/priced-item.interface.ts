import { ExternalPrice } from './external-price.interface';

export interface PricedItem {
    id: string;
    name: string;
    frameType: number;
    calculated: number;
    max: number;
    mean: number;
    median: number;
    min: number;
    mode: number;
    stackSize: number;
    totalStacksize: number;
    links: number;
    quality: number;
    level: number;
    corrupted: boolean;
    icon: string;
    sockets: number;
}


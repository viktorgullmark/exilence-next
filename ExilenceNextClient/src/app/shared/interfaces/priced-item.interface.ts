import { ExternalPrice } from './external-price.interface';

export interface PricedItem {
    id: string;
    name: string;
    externalPrice: ExternalPrice;
}


import { Tab } from './stash.interface';

export interface NetWorthStash {
    tabs: Array<Tab>;
    tabCount: number;
    tabCountFetched: number;
}

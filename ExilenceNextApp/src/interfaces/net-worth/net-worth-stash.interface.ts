import { ITab } from '../stash.interface';

export interface INetWorthStash {
    tabs: Array<ITab>;
    tabCount: number;
    tabCountFetched: number;
}

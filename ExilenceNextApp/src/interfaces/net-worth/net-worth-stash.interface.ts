import { IStashTab } from '../stash.interface';

export interface INetWorthStash {
    tabs: Array<IStashTab>;
    tabCount: number;
    tabCountFetched: number;
}

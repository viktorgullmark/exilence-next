import { TabSnapshot } from './tab-snapshot.interface';

export interface ISnapshot {
    timestamp: Date;
    league: string;
    tabSnapshots: Array<TabSnapshot>;
}

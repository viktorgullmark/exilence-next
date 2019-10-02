import { TabSnapshot } from './tab-snapshot.interface';

export interface Snapshot {
    timestamp: Date;
    league: string;
    tabSnapshots: Array<TabSnapshot>;
}

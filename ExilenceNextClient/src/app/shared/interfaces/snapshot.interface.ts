import { TabSnapshot } from './tab-snapshot.interface';

export interface Snapshot {
    timestamp: Date;
    tabSnapshots: Array<TabSnapshot>;
}

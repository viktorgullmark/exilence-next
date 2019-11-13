import { IStashTabSnapshot } from './stash-tab-snapshot.interface';

export interface ISnapshot {
    timestamp: Date;
    stashTabSnapshots: Array<IStashTabSnapshot>;
}

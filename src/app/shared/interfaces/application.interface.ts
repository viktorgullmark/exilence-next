export interface Application {
    snapshotting: boolean;
    lastSnapshot: Date;
    selectedTabs: Array<string>;
}

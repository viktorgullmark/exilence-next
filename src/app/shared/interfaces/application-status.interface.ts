export interface ApplicationStatus {
    snapshotting: boolean;
    lastSnapshot: Date;
    selectedTabs: Array<string>;
}

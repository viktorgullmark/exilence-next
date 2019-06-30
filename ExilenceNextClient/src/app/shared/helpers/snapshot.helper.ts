export class SnapshotHelper {
    public static formatSnapshotsForChart(tabIds: string[], snapshots: any[]) {
        const data = [];
        const columnNames = ['Time'];

        if (tabIds.length > 0) {
            for (let i = 0; i < tabIds.length; i++) {
                columnNames.push(tabIds[i]);
                for (let j = 0; j < snapshots.length; j++) {
                    const tabValue = snapshots[j].tabSnapshots.find(ts => ts.tabId === tabIds[i]).value;
                    // if first snapshot, start by creating new arr to store data in
                    if (i === 0) {
                        data.push([
                            snapshots[j].timestamp
                        ]);
                    }
                    data[j].push(tabValue)
                }
            }
        }

        return { data, columnNames };
    }
}

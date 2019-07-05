import { ChartSeries, ChartSeriesEntry } from '../interfaces/chart.interface';
import { Snapshot } from '../interfaces/snapshot.interface';
import { CompactTab } from '../interfaces/stash.interface';

export class SnapshotHelper {
    public static formatSnapshotsForChart(compactTabs: CompactTab[], snapshots: Snapshot[]): Array<ChartSeries> {
        const chartSeries: ChartSeries[] = compactTabs.map(tab => {
            return { name: tab.i + ' - ' + tab.n, series: [], id: tab.id } as ChartSeries;
        });

        for (let i = 0; i < snapshots.length; i++) {
            for (let j = 0; j < snapshots[i].tabSnapshots.length; j++) {
                const tabSeries = chartSeries.find(cs => cs.id === snapshots[i].tabSnapshots[j].tabId);
                if (tabSeries !== undefined) {
                    tabSeries.series.push({ name: snapshots[i].timestamp, value: snapshots[i].tabSnapshots[j].value } as ChartSeriesEntry);
                    chartSeries[chartSeries.indexOf(tabSeries)] = tabSeries;
                }
            }
        }

        return chartSeries;
    }
}

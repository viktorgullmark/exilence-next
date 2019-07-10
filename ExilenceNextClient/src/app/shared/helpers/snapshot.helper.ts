import { ChartSeries, ChartSeriesEntry } from '../interfaces/chart.interface';
import { Snapshot } from '../interfaces/snapshot.interface';
import { CompactTab } from '../interfaces/stash.interface';
import { Observable, of } from 'rxjs';

export class SnapshotHelper {
    public static formatSnapshotsForTabChart(compactTabs: CompactTab[], snapshots: Snapshot[]): Array<ChartSeries> {
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

    // todo: rebuild function when group support is added
    public static formatSnapshotsForPlayerChart(players: string[], compactTabs: CompactTab[], snapshots: Snapshot[]): Array<ChartSeries> {
        const chartSeries: ChartSeries[] = players.map(p => {
            return { name: p, series: [] } as ChartSeries;
        });

        for (let i = 0; i < snapshots.length; i++) {
            let value = 0;
            for (let j = 0; j < snapshots[i].tabSnapshots.length; j++) {
                const tabSeries = compactTabs.find(ct => ct.id === snapshots[i].tabSnapshots[j].tabId);
                if (tabSeries !== undefined) {
                    value += snapshots[i].tabSnapshots[j].value;
                }
            }
            chartSeries[0].series.push({ name: snapshots[i].timestamp, value: value } as ChartSeriesEntry);
        }

        return chartSeries;
    }
}

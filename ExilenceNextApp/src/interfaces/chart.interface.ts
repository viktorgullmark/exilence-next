export interface ChartSeries {
  name: string;
  id: string;
  series: ChartSeriesEntry[];
}

export interface ChartSeriesEntry {
  name: string | Date;
  value: number;
}

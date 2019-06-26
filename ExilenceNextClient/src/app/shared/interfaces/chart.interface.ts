export interface ChartSeries {
  name: string;
  series: ChartSeriesEntry[];
}

export interface ChartSeriesEntry {
  name: string | Date;
  value: number;
}

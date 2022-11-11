import HC from 'highcharts';

export interface IConnectionChartSeries {
  seriesName: string;
  series: number[][];
}

type PointClickEventObjectExtended = HC.PointClickEventObject & {
  // Defined in api but missing in type?
  point: { id: string };
};

export interface IDataChartSeries {
  x: number;
  y: number;
  id?: string;
  // custom?: any;
  events?: {
    click: (e: PointClickEventObjectExtended) => void;
  };
  marker?: {
    radius: number;
    symbol: string;
  };
  selected?: boolean;
}

export interface ISessionTimeChartSeries {
  type: string;
  name: string;
  colorIndex: number;
  data: IDataChartSeries[];
  fillColor: {
    linearGradient: {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
    };
    stops: (number | HC.ColorType)[][];
  };
}

export interface ISnapshotDataPoint {
  value: number;
  created: number;
}

export interface IDataPieChartSeries {
  name: string;
  y: number;
  sliced?: boolean;
  selected?: boolean;
  colorIndex?: number;
  color?: HC.ColorType;
  dataLabels?: {
    distance?: number;
    enabled?: boolean;
  };
}

export interface ISessionTimePieChartSeries {
  name: string;
  tooltip: {
    pointFormatter: Highcharts.FormatterCallbackFunction<Highcharts.Point>;
  };
  data: IDataPieChartSeries[];
  size?: string;
  innerSize?: string;
  dataLabels?: {
    distance?: number;
    enabled?: boolean;
  };
  borderColor?: string;
  borderWidth?: number;
}

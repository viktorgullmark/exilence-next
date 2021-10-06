export interface IExternalPrice {
  name: string;
  calculated?: number;
  max?: number;
  mean?: number;
  median?: number;
  min?: number;
  mode?: number;
  frameType?: number;
  variant?: string;
  elder?: boolean;
  shaper?: boolean;
  baseType?: string;
  links?: number;
  quality?: number;
  ilvl?: number;
  level?: number;
  corrupted?: boolean;
  totalStacksize?: number;
  icon: string;
  tier?: number;
  count: number;
  detailsUrl?: string;
  customPrice?: number;
  sparkLine?: ISparkLineDetails;
}

export interface ISparkLineDetails {
  data: number[];
  totalChange: number;
}

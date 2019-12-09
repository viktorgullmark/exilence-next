export interface IPoeWatchCombinedPriceItemData {
  id: number;
  mean: number;
  median: number;
  mode: number;
  min: number;
  max: number;
  exalted: number;
  count: number;
  baseItemLevel?: number;
  baseIsShaper?: boolean;
  baseIsElder?: boolean;
  stackSize?: number;
  fullname?: string;
  name: string;
  type: string;
  frame: number;
  tier?: any;
  gemLevel?: any;
  gemQuality?: any;
  gemIsCorrupted?: any;
  linkCount?: any;
  ilvl?: any;
  variation?: any;
  icon: string;
  category: string;
  group: string;
}

export interface IPoeWatchItem {
  id: number;
  name: string;
  type: string;
  category: string;
  group: string;
  frame: number;
  mapSeries?: number;
  mapTier?: number;
  baseIsShaper: boolean;
  baseIsElder: boolean;
  baseItemLevel: number;
  gemLevel: number;
  gemQuality: number;
  gemIsCorrupted: boolean;
  enchantMin?: number;
  enchantMax?: number;
  stackSize?: number;
  linkCount?: number;
  variation: string;
  icon: string;
}

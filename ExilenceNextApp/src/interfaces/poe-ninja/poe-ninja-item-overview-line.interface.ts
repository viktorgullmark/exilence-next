import { IPoeNinjaItemOverviewLineExplicitModifier } from './poe-ninja-item-overview-line-explicit-modifier.interface';
import { IPoeNinjaItemOverviewLineLowConfidenceSparkline } from './poe-ninja-item-overview-line-low-confidence-spark-line.interface';
import { IPoeNinjaItemOverviewLineSparkline } from './poe-ninja-item-overview-line-spark-line.interface';

export interface IPoeNinjaItemOverviewLine {
  id: number;
  name: string;
  icon: string;
  mapTier: number;
  levelRequired: number;
  baseType?: any;
  stackSize: number;
  variant?: any;
  prophecyText?: any;
  artFilename?: any;
  links: number;
  itemClass: number;
  sparkline: IPoeNinjaItemOverviewLineSparkline;
  lowConfidenceSparkline: IPoeNinjaItemOverviewLineLowConfidenceSparkline;
  implicitModifiers: any[];
  explicitModifiers: IPoeNinjaItemOverviewLineExplicitModifier[];
  flavourText: string;
  corrupted: boolean;
  gemLevel: number;
  gemQuality: number;
  itemType: string;
  chaosValue: number;
  exaltedValue: number;
  count: number;
  detailsId: string;
}

import { PoeNinjaItemOverviewLineSparkline } from './poe-ninja-item-overview-line-spark-line.interface';
import { PoeNinjaItemOverviewLineLowConfidenceSparkline } from './poe-ninja-item-overview-line-low-confidence-spark-line.interface';
import { PoeNinjaItemOverviewLineExplicitModifier } from './poe-ninja-item-overview-line-explicit-modifier.interface';

    export interface PoeNinjaItemOverviewLine {
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
        sparkline: PoeNinjaItemOverviewLineSparkline;
        lowConfidenceSparkline: PoeNinjaItemOverviewLineLowConfidenceSparkline;
        implicitModifiers: any[];
        explicitModifiers: PoeNinjaItemOverviewLineExplicitModifier[];
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





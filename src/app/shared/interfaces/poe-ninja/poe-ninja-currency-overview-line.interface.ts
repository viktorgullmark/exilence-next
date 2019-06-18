
import { PoeNinjaCurrencyOverviewLineSparkLine } from './poe-ninja-currency-overview-line-spark-line.interface';
import { PoeNinjaCurrencyOverviewLinePayOrReceive } from './poe-ninja-currency-overview-line-pay-or-receive.interface';

    export interface PoeNinjaCurrencyOverviewLine {
        detailsId: string;
        currencyTypeName: string;
        chaosEquivalent: number;
        pay: PoeNinjaCurrencyOverviewLinePayOrReceive;
        receive: PoeNinjaCurrencyOverviewLinePayOrReceive;
        paySparkLine: PoeNinjaCurrencyOverviewLineSparkLine;
        receiveSparkLine: PoeNinjaCurrencyOverviewLineSparkLine;
        lowConfidencePaySparkLine: PoeNinjaCurrencyOverviewLineSparkLine;
        lowConfidenceReceiveSparkLine: PoeNinjaCurrencyOverviewLineSparkLine;
    }

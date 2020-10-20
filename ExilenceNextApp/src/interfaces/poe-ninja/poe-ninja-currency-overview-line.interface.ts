import { IPoeNinjaCurrencyOverviewLinePayOrReceive } from './poe-ninja-currency-overview-line-pay-or-receive.interface';
import { IPoeNinjaCurrencyOverviewLineSparkLine } from './poe-ninja-currency-overview-line-spark-line.interface';

export interface IPoeNinjaCurrencyOverviewLine {
  detailsId: string;
  currencyTypeName: string;
  chaosEquivalent: number;
  pay: IPoeNinjaCurrencyOverviewLinePayOrReceive;
  receive: IPoeNinjaCurrencyOverviewLinePayOrReceive;
  paySparkLine: IPoeNinjaCurrencyOverviewLineSparkLine;
  receiveSparkLine: IPoeNinjaCurrencyOverviewLineSparkLine;
  lowConfidencePaySparkLine: IPoeNinjaCurrencyOverviewLineSparkLine;
  lowConfidenceReceiveSparkLine: IPoeNinjaCurrencyOverviewLineSparkLine;
}

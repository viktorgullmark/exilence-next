import { IPoeNinjaCurrencyOverviewCurrencyDetail } from './poe-ninja-currency-overview-currency-detail.interface';
import { IPoeNinjaCurrencyOverviewLine } from './poe-ninja-currency-overview-line.interface';

export interface IPoeNinjaCurrencyOverview {
  lines: IPoeNinjaCurrencyOverviewLine[];
  currencyDetails: IPoeNinjaCurrencyOverviewCurrencyDetail[];
}

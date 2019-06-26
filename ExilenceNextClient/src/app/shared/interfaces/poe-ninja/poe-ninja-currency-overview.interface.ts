import { PoeNinjaCurrencyOverviewCurrencyDetail } from './poe-ninja-currency-overview-currency-detail.interface';
import { PoeNinjaCurrencyOverviewLine } from './poe-ninja-currency-overview-line.interface';

    export interface PoeNinjaCurrencyOverview {
        lines: PoeNinjaCurrencyOverviewLine[];
        currencyDetails: PoeNinjaCurrencyOverviewCurrencyDetail[];
    }




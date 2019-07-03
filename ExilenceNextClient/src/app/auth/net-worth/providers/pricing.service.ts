import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { NetWorthState } from '../../../app.states';

@Injectable()
export class PricingService {

    constructor(
        private netWorthStore: Store<NetWorthState>
    ) {
    }
}

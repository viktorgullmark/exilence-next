import { Injectable } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';

import { NetWorthActionTypes } from '../../../store/net-worth/net-worth.actions';
import * as netWorthActions from './../../../store/net-worth/net-worth.actions';
import { Store } from '@ngrx/store';
import { NetWorthState } from '../../../app.states';

@Injectable()
export class ItemPricingService {

    constructor(
        private actions$: Actions,
        private netWorthStore: Store<NetWorthState>
    ) {

        this.actions$.pipe(ofType(NetWorthActionTypes.FetchPricesSuccess))
            .combineLatest(this.actions$.pipe(
                ofType(NetWorthActionTypes.FetchItemsForSnapshotSuccess)))
            .subscribe((res: any) => {
                this.netWorthStore.dispatch(new netWorthActions.PriceItemsForSnapshot({ tabs: res[1].payload.tabs }));
            });
    }

}

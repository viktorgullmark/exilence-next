import { Injectable } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';

import { NetWorthActionTypes } from '../../../store/net-worth/net-worth.actions';
import * as netWorthActions from '../../../store/net-worth/net-worth.actions';
import { Store } from '@ngrx/store';
import { NetWorthState } from '../../../app.states';
import { ExternalPrices } from '../../../shared/interfaces/external-prices.interface';
import { Tab } from '../../../shared/interfaces/stash.interface';
import { of } from 'rxjs';
import { Item } from '../../../shared/interfaces/item.interface';
import { PricedItem } from '../../../shared/interfaces/priced-item.interface';

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
                this.netWorthStore.dispatch(new netWorthActions.PriceItemsForSnapshot(
                    { prices: res[0].payload, tabs: res[1].payload.tabs }));
            });
    }

    priceItemsInTabs(tabs: Tab[], prices: ExternalPrices) {
        const combinedPrices = [...prices.poeNinja];

        prices.poeWatch.forEach(p => {
            const foundPrice = combinedPrices.find(cp => cp.name === p.name);
            foundPrice !== undefined
            ? (combinedPrices[combinedPrices.indexOf(foundPrice)] = {...p, ...foundPrice})
            : combinedPrices.push(p);
        });

        tabs.forEach((tab: Tab) => {
            tab.items.map((item: PricedItem) => {
                const foundPrice = combinedPrices.find(price => price.name === item.name);

                // todo: read setting for chosen price, to use ninja or watch here
                item.value = foundPrice !== undefined && foundPrice.calculated !== undefined ? foundPrice.calculated : 0;
                return item;
            });
        });
        return of(tabs);
    }

}

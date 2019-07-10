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
import { ExternalPrice } from '../../../shared/interfaces/external-price.interface';
import { PriceHelper } from '../../../shared/helpers/price.helper';

@Injectable()
export class ItemPricingService {

    private prices: ExternalPrice[];

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

        // todo: select price array based on setting
        prices.poeWatch.forEach(p => {
            const foundPrice = combinedPrices.find(cp => cp.name === p.name);
            foundPrice !== undefined
                ? (combinedPrices[combinedPrices.indexOf(foundPrice)] = { ...p, ...foundPrice })
                : combinedPrices.push(p);
        });

        this.prices = combinedPrices;

        tabs.forEach((tab: Tab) => {
            tab.items.map((item: PricedItem) => {
                return this.priceItem(item);
            });
        });

        return of(tabs);
    }

    priceItem(item: PricedItem): PricedItem {

        switch (item.frameType) {
            case 0: // normal
                break;
            case 1: // magic
                break;
            case 2: // rare
                break;
            case 3: // unique
                break;
            case 4: // gem
                break;
            case 5: // currency
                item = PriceHelper.mapPriceToItem(item, this.priceCheckByName(item.name));
                break;
            case 6: // divination card
                item = PriceHelper.mapPriceToItem(item, this.priceCheckDivinationCard(item.name));
                break;
            case 8: // prophecy
                item = PriceHelper.mapPriceToItem(item, this.priceCheckByName(item.name));
                break;
            case 9: // relic
                item = PriceHelper.mapPriceToItem(item, this.priceCheckByName(item.name));
                break;
            default:
        }

        return item;
    }

    priceCheckByName(name: string) {
        if (name === 'Chaos Orb') {
            return {
                max: 1,
                min: 1,
                median: 1,
                mean: 1,
                calculated: 1
            } as ExternalPrice;
        }
        return this.prices.find(p => p.name === name);
    }

    priceCheckDivinationCard(name: string) {
        return this.prices.find(p => p.name === p.name && p.icon.indexOf('Divination') > -1);
    }

}

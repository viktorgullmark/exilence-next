import { Injectable, Predicate } from '@angular/core';
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

        let price: ExternalPrice;

        if (item.name === 'Chaos Orb') {
            price = {
                max: 1,
                min: 1,
                median: 1,
                mean: 1,
                calculated: 1
            } as ExternalPrice;
        } else {
            switch (item.frameType) {
                case 0: // normal
                case 1: // magic
                case 2: // rare
                    if (item.name.indexOf(' Map') > -1) {
                        price = this.priceCheck(p =>
                            (p.name === name || item.name.indexOf(p.name) > -1) && p.tier === item.tier);
                    } else if (item.ilvl > 0) {
                        if (item.ilvl > 86) {
                            item.ilvl = 86;
                        }
                        price = this.priceCheck(p => p.baseType === item.typeLine && p.level === item.ilvl && p.variant === item.variant);
                    } else { // other (e.g fragments, scrabs)
                        price = this.priceCheck(p => p.name === item.name);
                    }
                    break;
                case 3: // unique
                    price = this.priceCheck(p => p.name === name
                        && p.links === item.links
                        && p.frameType === 3
                        && p.corrupted === item.corrupted
                        && p.quality === item.quality
                        && (p === item.variant || p.variant === undefined || p.variant === null));
                    break;
                case 4: // gem
                    price = this.priceCheck(p => p.name === name
                        && p.level === item.level
                        && p.corrupted === item.corrupted
                        && p.quality === item.quality);
                    break;
                case 5: // currency
                    price = this.priceCheck(p => p.name === item.name);
                    break;
                case 6: // divination card
                    price = this.priceCheck(p => p.name === name && p.icon.indexOf('Divination') > -1);
                    break;
                case 8: // prophecy
                    price = this.priceCheck(p => p.name === item.name && p.icon.indexOf('Prophecy') > -1);
                    break;
                case 9: // relic
                    price = this.priceCheck(p => p.name === item.name);
                    break;
                default:
                    price = this.priceCheck(p => p.name === item.name);
            }
        }

        return PriceHelper.mapPriceToItem(item, price);
    }

    priceCheck(expression: Predicate<ExternalPrice>) {
        return this.prices.find(expression);
    }
}

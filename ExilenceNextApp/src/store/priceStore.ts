import { action, observable, runInAction } from 'mobx';
import { fromStream } from 'mobx-utils';
import { forkJoin, from, of } from 'rxjs';
import { catchError, map, switchMap, mapTo, concatMap } from 'rxjs/operators';

import { NotificationType } from '../enums/notification-type.enum';
import { IExternalPrice } from '../interfaces/external-price.interface';
import { ILeaguePriceSource } from './../interfaces/league-price-source.interface';
import { poeninjaService } from './../services/poe-ninja.service';
import { LeaguePriceDetails } from './domains/league-price-details';
import { PriceSource } from './domains/price-source';
import { LeagueStore } from './leagueStore';
import { NotificationStore } from './notificationStore';
import { UiStateStore } from './uiStateStore';

export class PriceStore {
  @observable priceSources: PriceSource[] = [
    new PriceSource({
      name: 'poe-ninja',
      url: 'https://poe.ninja'
    })
  ];

  @observable
  leaguePriceDetails: LeaguePriceDetails[] = [];
  @observable activePriceSourceUuid: string = '';
  @observable isUpdatingPrices: boolean = false;

  constructor(
    private uiStateStore: UiStateStore,
    private leagueStore: LeagueStore,
    private notificationStore: NotificationStore
  ) {}

  @action
  setActivePriceSource(uuid: string) {
    this.activePriceSourceUuid = uuid;
  }

  @action
  getPricesForLeagues(leagueIds: string[]) {
    this.isUpdatingPrices = true;
    fromStream(
      forkJoin(
        from(leagueIds).pipe(
          concatMap((leagueId: string) => {
            const league = this.leagueStore.leagues.find(
              l => l.id === leagueId
            );
            let leaguePriceDetails = this.leaguePriceDetails.find(
              l => l.leagueId === leagueId
            );

            if (!leaguePriceDetails) {
              leaguePriceDetails = new LeaguePriceDetails();
              leaguePriceDetails.leagueId = leagueId;
              this.leaguePriceDetails.push(leaguePriceDetails);
            }

            // todo: remove hardcoded check for poeninja
            let leaguePriceSource = leaguePriceDetails!.leaguePriceSources.find(
              lps => lps.priceSourceUuid === this.priceSources[0].uuid
            );

            if (!leaguePriceSource) {
              // todo: add function for lookup
              leaguePriceDetails!.addLeaguePriceSource(<ILeaguePriceSource>{
                priceSourceUuid: this.priceSources[0].uuid
              });
            }

            if (!league) {
              throw Error('error:no_league');
            }
            return forkJoin(
              // todo: add watch and other sources here
              poeninjaService.getCurrencyPrices(league.id),
              poeninjaService.getItemPrices(league.id)
            ).pipe(
              map(prices => {
                const combinedPrices: IExternalPrice[] = ([] as any).concat.apply(
                  [],
                  [prices[0], prices[1]]
                );
                const ninjaPrices: IExternalPrice[] = [];
                combinedPrices.forEach(p => {
                  ninjaPrices.push(p);
                });

                const lps = leaguePriceDetails!.leaguePriceSources.find(
                  lps => lps.priceSourceUuid === this.priceSources[0].uuid
                );

                runInAction(() => {
                  console.log('should update prices')
                  lps!.updatePrices(ninjaPrices);
                });
              })
            );
          })
        )
      ).pipe(
        switchMap(() => {
          return of(this.getPricesforLeaguesSuccess());
        }),
        catchError((e: Error) => of(this.getPricesforLeaguesFail(e)))
      )
    );
  }

  @action
  getPricesforLeaguesSuccess() {
    console.log(this.leaguePriceDetails);
    this.isUpdatingPrices = false;
    this.notificationStore.createNotification(
      'get_prices_for_leagues',
      NotificationType.Success
    );
  }

  @action
  getPricesforLeaguesFail(error: Error | string) {
    this.isUpdatingPrices = false;
    this.notificationStore.createNotification(
      'get_prices_for_leagues',
      NotificationType.Error
    );

    console.error(error);
  }
}

import { action, observable, runInAction } from 'mobx';
import { persist } from 'mobx-persist';
import { fromStream } from 'mobx-utils';
import { forkJoin, of, from } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { stores } from '..';
import { NotificationType } from '../enums/notification-type.enum';
import { IExternalPrice } from '../interfaces/external-price.interface';
import { IPricedItem } from '../interfaces/priced-item.interface';
import { IStashTabSnapshot } from '../interfaces/stash-tab-snapshot.interface';
import { ILeaguePriceSource } from './../interfaces/league-price-source.interface';
import { poeninjaService } from './../services/poe-ninja.service';
import { LeaguePriceDetails } from './domains/league-price-details';
import { PriceSource } from './domains/price-source';
import { LeagueStore } from './leagueStore';
import { NotificationStore } from './notificationStore';
import { UiStateStore } from './uiStateStore';

export class PriceStore {
  @persist('list', PriceSource) @observable priceSources: PriceSource[] = [
    new PriceSource({
      name: 'poe-ninja',
      url: 'https://poe.ninja'
    })
  ];

  @persist('list', LeaguePriceDetails)
  @observable
  leaguePriceDetails: LeaguePriceDetails[] = [];
  @persist @observable activePriceSourceUuid: string = '';
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
      from(leagueIds).pipe(
        map(leagueId => {
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
                lps!.updatePrices(ninjaPrices);
              });
            })
          );
        }),
        catchError((e: Error) => of(this.getPricesforLeaguesFail(e)))
      )
    );

    this.getPricesforLeaguesSuccess();
  }

  @action
  getPricesforLeaguesSuccess() {
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

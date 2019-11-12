import { action, observable, runInAction } from 'mobx';
import { persist } from 'mobx-persist';
import { LeaguePriceDetails } from './domains/league-price-details';
import { PriceSource } from './domains/price-source';
import { LeagueStore } from './leagueStore';
import { UiStateStore } from './uiStateStore';
import { fromStream } from 'mobx-utils';
import { forkJoin, of } from 'rxjs';
import { poeninjaService } from './../services/poe-ninja.service';
import { map, catchError } from 'rxjs/operators';
import { NotificationStore } from './notificationStore';
import { IExternalPrice } from '../interfaces/external-price.interface';
import { LeaguePriceSource } from './domains/league-price-source';
import { ILeaguePriceSource } from './../interfaces/league-price-source.interface';
import { NotificationType } from '../enums/notification-type.enum';

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
  getPricesForLeague(leagueUuid: string) {
    const league = this.leagueStore.leagues.find(l => l.uuid === leagueUuid);
    let leaguePriceDetails = this.leaguePriceDetails.find(
      l => l.leagueUuid === leagueUuid
    );

    if (!leaguePriceDetails) {
      leaguePriceDetails = new LeaguePriceDetails();
      leaguePriceDetails.leagueUuid = leagueUuid;
      this.leaguePriceDetails.push(leaguePriceDetails);
    }

    if (!league) {
      throw Error('error:no_league');
    }

    fromStream(
      forkJoin(
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
          // todo: remove hardcoded check for poeninja
          let leaguePriceSource = leaguePriceDetails!.leaguePriceSources.find(
            lps => lps.priceSourceUuid === this.priceSources[0].uuid
          );
          
          runInAction(() => {
            if (!leaguePriceSource) {
              leaguePriceDetails!.addLeaguePriceSource(<ILeaguePriceSource>{
                priceSourceUuid: this.priceSources[0].uuid,
                prices: ninjaPrices
              })
            } else {
              leaguePriceSource.prices = ninjaPrices;
            }
          });
          this.getPricesforLeagueSuccess();
        }),
        catchError((e: Error) => of(this.getPricesforLeagueFail(e)))
      )
    );
  }

  @action
  getPricesforLeagueSuccess() {
    this.notificationStore.createNotification({
      title: 'get_prices_for_league',
      description: 'get_prices_for_league',
      type: NotificationType.Success
    });
  }

  @action
  getPricesforLeagueFail(error: Error | string) {
    this.notificationStore.createNotification({
      title: 'get_prices_for_league',
      description: 'get_prices_for_league',
      type: NotificationType.Error
    });

    console.error(error);
  }
}

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
    let details = this.leaguePriceDetails.find(
      l => l.leagueUuid === leagueUuid
    );

    if (!details) {
      details = new LeaguePriceDetails();
      details.leagueUuid = leagueUuid;
      this.leaguePriceDetails.push(details);
    }

    if (!league) {
      throw Error('error.no_league');
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
          let ninjaPrices: IExternalPrice[] = [];
          combinedPrices.forEach(cat => {
            ninjaPrices = ninjaPrices.concat(cat);
          });
          // todo: remove hardcoded check for poeninja
          let leaguePriceSource = details!.leaguePriceSources.find(
            lps => lps.priceSourceUuid === this.priceSources[0].uuid
          );
          runInAction(() => {
            if (!leaguePriceSource) {
              leaguePriceSource = new LeaguePriceSource();
              leaguePriceSource.prices = ninjaPrices;
              leaguePriceSource.priceSourceUuid = this.priceSources[0].uuid;
              details!.leaguePriceSources.push(leaguePriceSource);
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
      title: 'action.success.title.get_prices_for_league',
      description: 'action.success.desc.get_prices_for_league'
    });
  }

  @action
  getPricesforLeagueFail(error: Error | string) {
    this.notificationStore.createNotification({
      title: 'action.fail.title.get_prices_for_league',
      description: 'action.fail.desc.get_prices_for_league'
    });

    console.error(error);
  }
}

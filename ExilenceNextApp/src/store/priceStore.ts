import { action, observable } from 'mobx';
import { fromStream } from 'mobx-utils';
import { forkJoin, from, of } from 'rxjs';
import { catchError, concatMap, map, switchMap } from 'rxjs/operators';
import { IExternalPrice } from '../interfaces/external-price.interface';
import { ILeaguePriceSource } from './../interfaces/league-price-source.interface';
import { poeninjaService } from './../services/poe-ninja.service';
import { LeaguePriceDetails } from './domains/league-price-details';
import { LeaguePriceSource } from './domains/league-price-source';
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
  getLeaguePriceDetails(leagueId: string) {
    let leaguePriceDetails = this.leaguePriceDetails.find(
      l => l.leagueId === leagueId
    );

    if (!leaguePriceDetails) {
      leaguePriceDetails = new LeaguePriceDetails();
      leaguePriceDetails.leagueId = leagueId;
      this.leaguePriceDetails.push(leaguePriceDetails);
    }

    return leaguePriceDetails;
  }

  @action
  getLeaguePriceSource(leaguePriceDetails: LeaguePriceDetails) {
    // todo: remove hardcoded check for poeninja
    let leaguePriceSource = leaguePriceDetails.leaguePriceSources.find(
      lps => lps.priceSourceUuid === this.priceSources[0].uuid
    );

    if (!leaguePriceSource) {
      leaguePriceSource = new LeaguePriceSource(<ILeaguePriceSource>{
        priceSourceUuid: this.priceSources[0].uuid
      });
      leaguePriceDetails.addLeaguePriceSource(leaguePriceSource);
    }

    return leaguePriceSource;
  }

  @action
  getPricesForLeagues() {
    const leagueIds = this.leagueStore.priceLeagues.map(l => l.id);
    this.isUpdatingPrices = true;
    fromStream(
      forkJoin(
        from(leagueIds).pipe(
          concatMap((leagueId: string) => {
            const league = this.leagueStore.leagues.find(
              l => l.id === leagueId
            );

            const leaguePriceDetails = this.getLeaguePriceDetails(leagueId);

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

                const leaguePriceSource = this.getLeaguePriceSource(
                  leaguePriceDetails
                );
                leaguePriceSource.updatePrices(ninjaPrices);
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
    this.isUpdatingPrices = false;
    this.notificationStore.createNotification(
      'get_prices_for_leagues',
      'success'
    );
  }

  @action
  getPricesforLeaguesFail(error: Error | string) {
    this.isUpdatingPrices = false;
    this.notificationStore.createNotification(
      'get_prices_for_leagues',
      'error'
    );

    console.error(error);
  }
}

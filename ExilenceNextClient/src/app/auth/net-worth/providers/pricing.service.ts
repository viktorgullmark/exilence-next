import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AppState, NetWorthState } from '../../../app.states';
import { ApplicationSession } from '../../../shared/interfaces/application-session.interface';
import { selectApplicationSession } from '../../../store/application/application.selectors';
import { NetWorthActionTypes } from '../../../store/net-worth/net-worth.actions';
import * as netWorthActions from './../../../store/net-worth/net-worth.actions';
import { Actions } from '@ngrx/effects';

@Injectable()
export class PricingService {

    private session$: Observable<ApplicationSession>;
    private session: ApplicationSession;

    constructor(
        private appStore: Store<AppState>,
        private netWorthStore: Store<NetWorthState>,
        private actions$: Actions
    ) {
        this.session$ = this.appStore.select(selectApplicationSession);
        this.session$.subscribe((session: ApplicationSession) => {
          this.session = session;
        });

        this.pollPrices();
    }

    // todo: remove this, temporary code to test prices
    pollPrices() {
        setInterval(() => {
            this.netWorthStore.dispatch(new netWorthActions.FetchPrices({
                league: this.session.tradeLeague
              }));
        }, 1000 * 60)
    }
}

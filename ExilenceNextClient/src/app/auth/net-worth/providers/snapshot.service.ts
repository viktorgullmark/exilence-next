import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of, from } from 'rxjs';
import 'rxjs/add/operator/mergeMap';
import { NotificationType } from '../../../shared/enums/notification-type.enum';
import { NetWorthStatus } from '../../../shared/interfaces/net-worth-status.interface';
import { NotificationsState, NetWorthState } from './../../../app.states';
import { Notification } from './../../../shared/interfaces/notification.interface';
import * as netWorthActions from './../../../store/net-worth/net-worth.actions';
import * as netWorthReducer from './../../../store/net-worth/net-worth.reducer';
import * as notificationActions from './../../../store/notification/notification.actions';
import { selectNetWorthStatus } from '../../../store/net-worth/net-worth.selectors';
import { ApplicationSession } from '../../../shared/interfaces/application-session.interface';
import { Tab } from '../../../shared/interfaces/stash.interface';
import { selectApplicationSessionTabs, selectApplicationSession } from '../../../store/application/application.selectors';
import { ApplicationSessionDetails } from '../../../shared/interfaces/application-session-details.interface';

@Injectable()
export class SnapshotService {

  private netWorthStatus$: Observable<NetWorthStatus>;
  private tabs$: Observable<Tab[]>;
  private tabs: Tab[];
  private session$: Observable<ApplicationSession>;
  private session: ApplicationSession;

  constructor(
    private netWorthStore: Store<NetWorthState>,
    private appStore: Store<ApplicationSession>
  ) {

    this.netWorthStatus$ = this.netWorthStore.select(selectNetWorthStatus);

    this.tabs$ = this.appStore.select(selectApplicationSessionTabs);
    this.tabs$.subscribe((tabs: Tab[]) => {
      this.tabs = tabs;
    });

    this.session$ = this.appStore.select(selectApplicationSession);
    this.session$.subscribe((session: ApplicationSession) => {
      this.session = session;
    });

    this.startSnapshot();
  }

  startSnapshot() {
    this.netWorthStore.dispatch(new netWorthActions.FetchItemsForSnapshot({
      accountDetails: {
        account: this.session.account, sessionId: this.session.sessionId
      } as ApplicationSessionDetails,
      tabs: this.tabs
    }));
  }
}

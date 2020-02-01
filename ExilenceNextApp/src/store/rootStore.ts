import { UiStateStore } from './uiStateStore';
import { AccountStore } from './accountStore';
import { SignalrHub } from './domains/signalr-hub';
import { SettingStore } from './settingStore';
import { RouteStore } from './routeStore';
import { MigrationStore } from './migrationStore';
import { UpdateStore } from './updateStore';
import { LeagueStore } from './leagueStore';
import { NotificationStore } from './notificationStore';
import { SignalrStore } from './signalrStore';
import { PriceStore } from './priceStore';

export class RootStore {
  uiStateStore: UiStateStore;
  accountStore: AccountStore;
  signalrHub: SignalrHub;
  settingStore: SettingStore;
  routeStore: RouteStore;
  migrationStore: MigrationStore;
  updateStore: UpdateStore;
  leagueStore: LeagueStore;
  notificationStore: NotificationStore;
  signalrStore: SignalrStore;
  priceStore: PriceStore;

  constructor() {
    this.uiStateStore = new UiStateStore(this);
    this.accountStore = new AccountStore(this);
    this.signalrHub = new SignalrHub(this);
    this.settingStore = new SettingStore(this);
    this.routeStore = new RouteStore(this);
    this.migrationStore = new MigrationStore(this);
    this.updateStore = new UpdateStore(this);
    this.leagueStore = new LeagueStore(this);
    this.notificationStore = new NotificationStore(this);
    this.signalrStore = new SignalrStore(this);
    this.priceStore = new PriceStore(this);
  }
}

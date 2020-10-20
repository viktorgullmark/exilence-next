import { AccountStore } from './accountStore';
import { SignalrHub } from './domains/signalr-hub';
import { LeagueStore } from './leagueStore';
import { MigrationStore } from './migrationStore';
import { NotificationStore } from './notificationStore';
import { OverlayStore } from './overlayStore';
import { PriceStore } from './priceStore';
import { RouteStore } from './routeStore';
import { SettingStore } from './settingStore';
import { SignalrStore } from './signalrStore';
import { UiStateStore } from './uiStateStore';
import { UpdateStore } from './updateStore';

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
  overlayStore: OverlayStore;

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
    this.overlayStore = new OverlayStore(this);
  }
}

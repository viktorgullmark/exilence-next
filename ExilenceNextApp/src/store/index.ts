import { AccountStore } from './accountStore';
import { SignalrHub } from './domains/signalr-hub';
import { LeagueStore } from './leagueStore';
import { MigrationStore } from './migrationStore';
import { NotificationStore } from './notificationStore';
import { PriceStore } from './priceStore';
import { RouteStore } from './routeStore';
import { SettingStore } from './settingStore';
import { SignalrStore } from './signalrStore';
import { UiStateStore } from './uiStateStore';
import { UpdateStore } from './updateStore';

const signalrHub: SignalrHub = new SignalrHub();
const settingStore = new SettingStore();
const uiStateStore = new UiStateStore();
const routeStore = new RouteStore();
const migrationStore = new MigrationStore();
const updateStore = new UpdateStore();
const leagueStore = new LeagueStore();
const notificationStore = new NotificationStore();
const signalrStore = new SignalrStore();
const priceStore = new PriceStore();
const accountStore = new AccountStore();

// make stores globally available for domain objects
const stores = {
  accountStore,
  uiStateStore,
  routeStore,
  notificationStore,
  migrationStore,
  leagueStore,
  priceStore,
  signalrStore,
  signalrHub,
  updateStore,
  settingStore
};

export default stores;
/// <reference path="./react-vis.d.ts"/> 

import { CssBaseline } from '@material-ui/core';
import { responsiveFontSizes } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import localForage from 'localforage';
import { configure } from 'mobx';
import { enableLogging } from 'mobx-logger';
import { create } from 'mobx-persist';
import { Provider } from 'mobx-react';
import React, { Suspense } from 'react';
import ReactDOM, { render } from 'react-dom';
import { HashRouter as Router, Redirect, Route } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.min.css';
import ua, { Visitor } from 'universal-analytics';
import exilenceTheme from './assets/themes/exilence-theme';
import DrawerWrapperContainer from './components/drawer-wrapper/DrawerWrapperContainer';
import GlobalStyles from './components/global-styles/GlobalStyles';
import HeaderContainer from './components/header/HeaderContainer';
import Notifier from './components/notifier/Notifier';
import ReactionContainer from './components/reaction-container/ReactionContainer';
import ToastWrapper from './components/toast-wrapper/ToastWrapper';
import ToolbarContainer from './components/toolbar/ToolbarContainer';
import AppConfig from './config/app.config';
import configureI18n from './config/i18n';
import initSentry from './config/sentry';
import Login from './routes/login/Login';
import NetWorth from './routes/net-worth/NetWorth';
import Settings from './routes/settings/Settings';
import { AccountStore } from './store/accountStore';
import { SignalrHub } from './store/domains/signalr-hub';
import { LeagueStore } from './store/leagueStore';
import { NotificationStore } from './store/notificationStore';
import { PriceStore } from './store/priceStore';
import { SettingStore } from './store/settingStore';
import { SignalrStore } from './store/signalrStore';
import { UiStateStore } from './store/uiStateStore';
import { UpdateStore } from './store/updateStore';
import { MigrationStore } from './store/migrationStore';

export const appName = 'Exilence Next';
export let visitor: Visitor | undefined = undefined;

initSentry();
enableLogging();
configureI18n();

configure({ enforceActions: 'observed' });

const theme = responsiveFontSizes(exilenceTheme());

localForage.config({
  name: 'exilence-next-db',
  driver: localForage.INDEXEDDB
});

const signalrHub: SignalrHub = new SignalrHub();

const settingStore = new SettingStore();
const uiStateStore = new UiStateStore();
const migrationStore = new MigrationStore();
const updateStore = new UpdateStore();
const leagueStore = new LeagueStore(uiStateStore);
const notificationStore = new NotificationStore(uiStateStore);
const signalrStore = new SignalrStore(
  uiStateStore,
  notificationStore,
  signalrHub
);
const priceStore = new PriceStore(leagueStore, notificationStore);
const accountStore = new AccountStore(
  uiStateStore,
  notificationStore,
  leagueStore,
  priceStore,
  signalrStore
);

// make stores globally available for domain objects
export const stores = {
  accountStore,
  uiStateStore,
  notificationStore,
  migrationStore,
  leagueStore,
  priceStore,
  signalrStore,
  signalrHub,
  updateStore,
  settingStore
};

const app = (
  <>
    <ThemeProvider theme={theme}>
      <Provider {...stores}>
        <Suspense fallback={null}>
          <Router>
            <CssBaseline />
            <GlobalStyles />
            <ToastWrapper />
            <Route path="/login" component={Login} />
            <HeaderContainer />
            <DrawerWrapperContainer>
              <ToolbarContainer />
              <Route path="/net-worth" component={NetWorth} />
              <Route path="/settings" component={Settings} />
              <Route
                exact
                path="/"
                render={() =>
                  accountStore.getSelectedAccount.name ? (
                    <Redirect to="/net-worth" />
                  ) : (
                    <Redirect to="/login" />
                  )
                }
              />
            </DrawerWrapperContainer>
            <Notifier />
            <ReactionContainer />
          </Router>
        </Suspense>
      </Provider>
    </ThemeProvider>
  </>
);

const hydrate = create({
  storage: localForage,
  jsonify: true
});

const renderApp = () => {
  Promise.all([
    hydrate('account', accountStore),
    hydrate('uiState', uiStateStore),
    hydrate('league', leagueStore),
    hydrate('setting', settingStore)
  ]).then(() => {
    visitor = ua(AppConfig.trackingId, uiStateStore.userId);
    ReactDOM.render(app, document.getElementById('root'));
  });
};

hydrate('migration', migrationStore).then(() => {
  if (migrationStore.current < migrationStore.latest) {
    migrationStore.runMigrations().subscribe(() => renderApp());
  } else {
    renderApp();
  }
});

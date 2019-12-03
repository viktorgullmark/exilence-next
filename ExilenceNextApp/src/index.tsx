import { CssBaseline } from '@material-ui/core';
import { responsiveFontSizes } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import localForage from 'localforage';
import { configure } from 'mobx';
import { enableLogging } from 'mobx-logger';
import { create } from 'mobx-persist';
import { Provider } from 'mobx-react';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Redirect, Route } from 'react-router-dom';
import exilenceTheme from './assets/themes/exilence-theme';
import HeaderContainer from './components/header/HeaderContainer';
import Notifier from './components/notifier/Notifier';
import SideNavContainer from './components/sidenav/SideNavContainer';
import ToolbarContainer from './components/toolbar/ToolbarContainer';
import GlobalStyles from './components/global-styles/GlobalStyles';
import configureI18n from './config/i18n';
import Login from './routes/login/Login';
import NetWorth from './routes/net-worth/NetWorth';
import { AccountStore } from './store/accountStore';
import { LeagueStore } from './store/leagueStore';
import { NotificationStore } from './store/notificationStore';
import { PriceStore } from './store/priceStore';
import { SignalrStore } from './store/signalrStore';
import { UiStateStore } from './store/uiStateStore';
import { SnackbarProvider } from 'notistack';
import Settings from './routes/settings/Settings';

enableLogging();
configureI18n();

configure({ enforceActions: 'observed' });

const theme = responsiveFontSizes(exilenceTheme());

localForage.config({
  name: 'exilence-next-db',
  driver: localForage.INDEXEDDB
});

const hydrate = create({
  storage: localForage,
  jsonify: true
});

const uiStateStore = new UiStateStore();
const leagueStore = new LeagueStore(uiStateStore);
const notificationStore = new NotificationStore(uiStateStore);
const priceStore = new PriceStore(uiStateStore, leagueStore, notificationStore);
const accountStore = new AccountStore(
  uiStateStore,
  notificationStore,
  leagueStore,
  priceStore
);
const signalrStore = new SignalrStore();

export const stores = {
  accountStore,
  uiStateStore,
  notificationStore,
  leagueStore,
  priceStore,
  signalrStore
};

const app = (
  <>
    <ThemeProvider theme={theme}>
      <Provider {...stores}>
        <SnackbarProvider>
          <Suspense fallback={null}>
            <Router>
              <CssBaseline />
              <GlobalStyles />
              <HeaderContainer />
              <SideNavContainer>
                <ToolbarContainer />
                <Route path="/net-worth" component={NetWorth} />
                <Route path="/login" component={Login} />
                <Route path="/settings" component={Settings} />
                <Route
                  exact
                  path="/"
                  render={() =>
                    accountStore.getSelectedAccount.name !== '' ? (
                      <Redirect to="/net-worth" />
                    ) : (
                      <Redirect to="/login" />
                    )
                  }
                />
              </SideNavContainer>
              <Notifier />
            </Router>
          </Suspense>
        </SnackbarProvider>
      </Provider>
    </ThemeProvider>
  </>
);

Promise.all([
  hydrate('account', accountStore),
  hydrate('uiState', uiStateStore),
  hydrate('league', leagueStore)
]).then(() => {
  ReactDOM.render(app, document.getElementById('root'));
});

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
import SideNavContainer from './components/sidenav/SideNavContainer';
import GlobalStyles from './core/global-styles/GlobalStyles';
import configureI18n from './i18n';
import Login from './routes/login/Login';
import NetWorth from './routes/net-worth/NetWorth';
import { authService } from './services/auth.service';
import { AccountStore } from './store/accountStore';
import { NotificationStore } from './store/notificationStore';
import { UiStateStore } from './store/uiStateStore';
import ToolbarContainer from './components/toolbar/ToolbarContainer';
import { PriceStore } from './store/priceStore';
import { LeagueStore } from './store/leagueStore';

// enableLogging();
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
const accountStore = new AccountStore(uiStateStore, notificationStore, leagueStore, priceStore);

const stores = { accountStore, uiStateStore, notificationStore, leagueStore, priceStore };

const app = (
  <>
    <ThemeProvider theme={theme}>
      <Provider {...stores}>
        <Suspense fallback={null}>
          <Router>
            <CssBaseline />
            <GlobalStyles />
            <HeaderContainer />
            <SideNavContainer>
              <ToolbarContainer />
              <Route path="/net-worth" component={NetWorth} />
              <Route path="/login" component={Login} />
              <Route
                exact
                path="/"
                render={() =>
                  authService.isLoggedIn() ? (
                    <Redirect to="/net-worth" />
                  ) : (
                    <Redirect to="/login" />
                  )
                }
              />
            </SideNavContainer>
          </Router>
        </Suspense>
      </Provider>
    </ThemeProvider>
  </>
);

Promise.all([
  hydrate('account', accountStore),
  hydrate('uiState', uiStateStore),
  hydrate('league', leagueStore),
  hydrate('prices', priceStore)
]).then(() => {
  ReactDOM.render(app, document.getElementById('root'));
});

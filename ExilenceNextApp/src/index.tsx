import { CssBaseline } from '@material-ui/core';
import { responsiveFontSizes } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import localForage from 'localforage';
import { enableLogging } from 'mobx-logger';
import { create } from 'mobx-persist';
import { Provider } from 'mobx-react';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Redirect, Route } from 'react-router-dom';
import exilenceTheme from './assets/themes/exilence-theme';
import HeaderContainer from './components/header/HeaderContainer';
import GlobalStyles from './core/global-styles/GlobalStyles';
import configureI18n from './i18n';
import Login from './routes/login/Login';
import NetWorth from './routes/net-worth/NetWorth';
import { authService } from './services/auth.service';
import { AccountStore } from './store/account/store';
import { UiStateStore } from './store/ui-state/store';

enableLogging();
configureI18n();

const theme = responsiveFontSizes(exilenceTheme());

localForage.config({
  name: 'exilence-next-db',
  driver: localForage.INDEXEDDB,
});

const hydrate = create({
  storage: localForage,
  jsonify: true
})

const accountStore = new AccountStore();
const uiStateStore = new UiStateStore();

const stores = { accountStore, uiStateStore };

hydrate('account', accountStore);

// todo: hydrate ui-state when we have something to persist

const app = (
  <React.Fragment>
    <ThemeProvider theme={theme}>
      <Provider {...stores}>
        <Suspense fallback={null}>
          <Router>
            <CssBaseline />
            <GlobalStyles />
            <HeaderContainer />
            <Route path="/net-worth" component={NetWorth} />
            <Route path="/login" component={Login} />
            <Route exact path="/" render={() => (
              authService.isLoggedIn() ? (
                <Redirect to="/net-worth" />
              ) : (
                  <Redirect to="/login" />
                )
            )} />
          </Router>
        </Suspense>
      </Provider>
    </ThemeProvider>
  </React.Fragment>
)

ReactDOM.render(app, document.getElementById('root'))




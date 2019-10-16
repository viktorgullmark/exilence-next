import { responsiveFontSizes } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';

import exilenceTheme from './assets/themes/exilence-theme';
import configureI18n from './i18n';
import NetWorth from './routes/net-worth/NetWorth';
import Login from './routes/login/Login';
import { authService } from './services/auth.service';
import { Provider } from 'mobx-react'
import { SessionStore } from './store/session/store';
import { CssBaseline } from '@material-ui/core';
import GlobalStyles from './core/global-styles/GlobalStyles';
import HeaderContainer from './components/header/HeaderContainer';
import { enableLogging } from 'mobx-logger';

enableLogging();
configureI18n();

const theme = responsiveFontSizes(exilenceTheme());

const sessionStore = new SessionStore();

const app = (
  <React.Fragment>
    <ThemeProvider theme={theme}>
      <Provider sessionStore={sessionStore}>
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

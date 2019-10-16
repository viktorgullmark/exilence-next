import { responsiveFontSizes } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom';

import exilenceTheme from './assets/themes/exilence-theme';
import App from './core/app/App';
import configureI18n from './i18n';
import NetWorth from './routes/net-worth/NetWorth';
import Login from './routes/login/Login';
import { authService } from './services/auth.service';

configureI18n();

const theme = responsiveFontSizes(exilenceTheme());

const routing = (
  <Suspense fallback={null}>
    <ThemeProvider theme={theme}>
      <Router>
        <Route path="/" component={App} />
        <Redirect from="/" to="/net-worth" />
        <Route path="/login" component={Login} />
        <Route path="/net-worth" render={() => (
          !authService.isLoggedIn() ? (
            <Redirect to="/login" />
          ) : (
              <NetWorth />
            )
        )} />
      </Router>
    </ThemeProvider>
  </Suspense>
)
ReactDOM.render(routing, document.getElementById('root'))

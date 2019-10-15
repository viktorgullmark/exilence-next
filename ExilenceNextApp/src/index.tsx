import { responsiveFontSizes } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';

import exilenceTheme from './assets/themes/exilence-theme';
import App from './core/app/App';
import configureI18n from './i18n';
import NetWorth from './routes/net-worth/NetWorth';
import Login from './routes/login/Login';
import configureStore from './store';
import { authService } from './services/auth.service';

configureI18n();

const theme = responsiveFontSizes(exilenceTheme());

const { store, persistor } = configureStore();

const routing = (
  <Suspense fallback={null}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
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
      </PersistGate>
    </Provider>
  </Suspense>
)
ReactDOM.render(routing, document.getElementById('root'))

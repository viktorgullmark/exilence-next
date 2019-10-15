import { responsiveFontSizes } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom';
import exilenceTheme from './assets/themes/exilence-theme';
import App from './core/app/App';
import Admin from './routes/admin/Admin';
import Login from './routes/login/Login';
import { initReactI18next } from "react-i18next";
import Backend from 'i18next-xhr-backend';
import i18n from 'i18next'
import AppConfig from './config/app.config';

const theme = responsiveFontSizes(exilenceTheme());

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    lng: 'en',
    backend: {
      /* translation file path */
      loadPath: AppConfig.i18nUrl,
      crossDomain: true
    },
    fallbackLng: 'en',
    debug: !AppConfig.production,
    ns: ['general'],
    defaultNS: 'general',
    keySeparator: false,
    interpolation: {
      escapeValue: false,
      formatSeparator: ','
    },
    react: {
      wait: true
    }
  });

const routing = (
  <Suspense fallback={null}>
    <ThemeProvider theme={theme}>
      <Router>
        <Route path="/" component={App} />
        <Redirect from="/" to="/admin" />
        <Route path="/login" component={Login} />
        <Route path="/admin" render={() => (
          // todo: implement proper auth check
          true ? (
            <Redirect to="/login" />
          ) : (
              <Admin />
            )
        )} />
      </Router>
    </ThemeProvider>
  </Suspense>
)
ReactDOM.render(routing, document.getElementById('root'))

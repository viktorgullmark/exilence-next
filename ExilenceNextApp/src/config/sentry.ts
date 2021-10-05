import * as Sentry from '@sentry/browser';

import AppConfig from './app.config';

function initSentry() {
  if (AppConfig.production) {
    Sentry.init({
      dsn: AppConfig.sentryBrowserDsn,
      ignoreErrors: [/^net::+.*$/, AppConfig.pathOfExileUrl, 'Network Error', 'NetworkError'],
    });
  }
}

export default initSentry;

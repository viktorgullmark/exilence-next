import * as Sentry from '@sentry/browser';

import AppConfig from './app.config';

function initSentry() {
  if (AppConfig.production) {
    Sentry.init({
      dsn: AppConfig.sentryBrowserDsn,
      ignoreErrors: [
        'Request failed',
        'net::',
        'Network Error',
        'HttpError',
        AppConfig.pathOfExileUrl,
        AppConfig.pathOfExileApiUrl,
        AppConfig.poeNinjaBaseUrl,
        AppConfig.githubBaseUrl,
      ],
    });
  }
}

export default initSentry;

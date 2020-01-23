import * as Sentry from '@sentry/browser';
import AppConfig from './app.config';

function initSentry() {
  if (AppConfig.production) {
    Sentry.init({
      dsn: AppConfig.sentryBrowserDsn,
      ignoreErrors: [
        '/(?<=^|\\s)net::\\w+/',
        'https://www.pathofexile.com',
        'Network Error',
        'NetworkError',
      ]
    });
  }
}

export default initSentry;

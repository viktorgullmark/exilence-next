import * as Sentry from '@sentry/browser';
import AppConfig from './app.config';

function initSentry() {
  if (AppConfig.production) {
    Sentry.init({
      dsn: AppConfig.sentryBrowserDsn,
      ignoreErrors: [
        'https://www.pathofexile.com',
        'Network Error',
        'NetworkError',
        'net::ERR_CONNECTION_TIMED_OUT',
        'net::ERR_NAME_RESOLUTION_FAILED',
        'net::ERR_NETWORK_IO_SUSPENDED',
        'net::ERR_NETWORK_CHANGED',
        'net::ERR_NAME_NOT_RESOLVED',
        'net::ERR_CONNECTION_RESET',
        'net::ERR_TIMED_OUT',
        'net::ERR_CONNECTION_REFUSED'
      ]
    });
  }
}

export default initSentry;

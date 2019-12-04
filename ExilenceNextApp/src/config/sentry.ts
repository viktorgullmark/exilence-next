import * as Sentry from '@sentry/browser';
import AppConfig from './app.config';

function initSentry() {
  Sentry.init({
    dsn: AppConfig.sentryBrowserDsn
  });
}

export default initSentry;

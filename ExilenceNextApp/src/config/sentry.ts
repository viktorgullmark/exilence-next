import * as Sentry from '@sentry/browser';

function initSentry() {
  Sentry.init({
    dsn: 'https://e69c936836334a2c9e4b553f20d1d51c@sentry.io/1843156'
  });
}

export default initSentry;

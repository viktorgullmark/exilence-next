import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { AppConfig } from './environments/environment';
import * as Sentry from '@sentry/electron';

Sentry.init({ dsn: 'https://81deb5bd2814402f9efd7db4cfd84fd2@sentry.io/1507995' });

if (AppConfig.production) {
  enableProdMode();
}

if (window) {
  window.console.warn = function () { };
}

platformBrowserDynamic()
  .bootstrapModule(AppModule, {
    preserveWhitespaces: false
  })
  .catch(err => console.error(err));

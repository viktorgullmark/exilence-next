import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { AppConfig } from './environments/environment';
import * as Sentry from '@sentry/electron';

if (AppConfig.production) {
  enableProdMode();
}

Sentry.init({ dsn: AppConfig.sentryDsn });

platformBrowserDynamic()
  .bootstrapModule(AppModule, {
    preserveWhitespaces: false
  })
  .catch(err => console.error(err));

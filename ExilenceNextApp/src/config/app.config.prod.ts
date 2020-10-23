import { electronService } from '../services/electron.service';

const prodConfig = {
  baseUrl: 'https://next.exilence.app',
  production: true,
  sentryBrowserDsn: 'https://123362e387b749feaf8f98a2cce30fdf@sentry.io/1852797',
  i18nUrl: electronService.remote.app.getAppPath() + '/../../public/i18n/{{lng}}/{{ns}}.json',
  trackingId: 'UA-154599999-2',
  redirectUrl: 'http://localhost:65535',
  oauthUrl: 'https://www.pathofexile.com',
  pathOfExileUrl: 'https://www.pathofexile.com',
  pathOfExileApiUrl: 'https://api.pathofexile.com',
  pathOfExileCookieDomain: '.pathofexile.com',
  poeNinjaBaseUrl: 'https://poe.ninja',
};

export default prodConfig;

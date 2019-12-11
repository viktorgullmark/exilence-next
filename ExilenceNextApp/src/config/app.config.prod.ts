import { electronService } from "../services/electron.service";

const prodConfig = {
    production: true,
    sentryBrowserDsn: 'https://123362e387b749feaf8f98a2cce30fdf@sentry.io/1852797',
    i18nUrl: electronService.remote.app.getAppPath() + '/../../public/i18n/{{lng}}/{{ns}}.json'
};

export default prodConfig;
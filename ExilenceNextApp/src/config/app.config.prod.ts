import { electronService } from "../services/electron.service";

const prodConfig = {
    production: true,
    sentryBrowserDsn: 'https://e69c936836334a2c9e4b553f20d1d51c@sentry.io/1843156',
    i18nUrl: electronService.remote.app.getAppPath() + '/../../public/i18n/{{lng}}/{{ns}}.json'
};

export default prodConfig;
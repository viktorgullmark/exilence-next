import { electronService } from "../services/electron.service";

const prodConfig = {
    production: true,
    baseUrl: 'http://exilence.app',
    i18nUrl: electronService.remote.app.getAppPath() + '/../../public/i18n/{{lng}}/{{ns}}.json'
};

export default prodConfig;
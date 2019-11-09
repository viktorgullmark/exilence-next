import { initReactI18next } from "react-i18next";
import Backend from 'i18next-xhr-backend';
import i18n from 'i18next'
import AppConfig from './../config/app.config';

function configureI18n() {
    i18n.use(Backend)
        .use(initReactI18next)
        .init({
            lng: 'en',
            backend: {
                /* translation file path */
                loadPath: AppConfig.i18nUrl,
                crossDomain: true
            },
            fallbackLng: 'en',
            debug: !AppConfig.production,
            ns: ['common', 'notification', 'error'],
            defaultNS: 'common',
            interpolation: {
                escapeValue: false,
                formatSeparator: ','
            },
            react: {
                wait: true
            }
        });
}

export default configureI18n;
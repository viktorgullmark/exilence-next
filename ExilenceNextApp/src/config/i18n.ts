import i18n from 'i18next';
import Backend from 'i18next-xhr-backend';
import { initReactI18next } from 'react-i18next';
import { electronService } from '../services/electron.service';
import AppConfig from './app.config';

const path = require('path');
const url = require('url');

function getTranslationPath(lng: string, ns: string) {
  const langPath = `/i18n/${lng}/${ns}.json`;
  const fullPath = url.format({
    pathname: path.join(electronService.appPath, `../public/${langPath}`),
    protocol: 'file:',
    slashes: true,
  });
  return AppConfig.production ? fullPath : path.resolve(electronService.appPath, langPath);
}

function configureI18n() {
  i18n
    .use(Backend)
    .use(initReactI18next)
    .init({
      lng: 'en',
      backend: {
        /* translation file path */
        loadPath: getTranslationPath,
        crossDomain: true,
      },
      fallbackLng: 'en',
      debug: false,
      ns: ['common', 'notification', 'error', 'tables', 'stepper', 'status'],
      defaultNS: 'common',
      interpolation: {
        escapeValue: false,
        formatSeparator: ',',
      },
      react: {
        wait: true,
      },
    });
}

export default configureI18n;

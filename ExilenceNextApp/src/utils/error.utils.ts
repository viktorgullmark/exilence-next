import i18n from 'i18next';

export function translateError(e: Error) {
  // check if error message appears to be a translation key, and translate it if so
  const prefix = 'notification:error.custom_description.';
  const regex = /^\w+$/g;
  if (!e.message) {
    e.message = 'notification:error.unknown_error';
  }
  return regex.test(e.message) ? i18n.t(`${prefix}${e.message}`) : e.message;
}

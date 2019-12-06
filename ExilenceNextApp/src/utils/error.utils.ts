import i18n from 'i18next';

export class ErrorUtils {
  public static translateError(e: Error) {
    // check if error message appears to be a translation key, and translate it if so
    const prefix = 'notification:error.custom_description.';
    var regex = /^\w+$/g;
    return regex.test(e.message) ? i18n.t(`${prefix}${e.message}`) : e.message;
  }
}


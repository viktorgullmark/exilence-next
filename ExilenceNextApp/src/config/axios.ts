import * as Sentry from '@sentry/browser';
import { AxiosError } from 'axios';
import Axios from 'axios-observable';
import { rootStore } from '..';

function configureAxios() {
  Axios.interceptors.request.use(
    function (config) {
      return config;
    },
    function (error: AxiosError) {
      return Promise.reject(error);
    }
  );

  Axios.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error: AxiosError) {
      if (
        error.response?.status === 401 ||
        error.response?.status === 403 ||
        (error.response?.status === 400 && error.response.data === 'error:token_expired')
      ) {
        rootStore.accountStore.cancelRetries();
        rootStore.routeStore.redirect('/login', 'error:token_expired');
      }
      if (error.response?.status === 429) {
        rootStore.accountStore.cancelRetries();
        const retryAfter = error.response?.headers['retry-after'];
        if (retryAfter) {
          rootStore.rateLimitStore.setRetryAfter(+retryAfter);
        }
        if (error.response?.headers['x-rate-limit-policy'] === 'stash-request-limit') {
          const state = error.response?.headers['x-rate-limit-account-state'];
          const customError = new Error(`Stash request limit reached, state: ${state}`);
          Sentry.captureException(customError);
        }
      }
      return Promise.reject(error);
    }
  );
}

export default configureAxios;

import Axios from 'axios-observable';
import { AxiosError } from 'axios';
import { rootStore } from '..';

function configureAxios() {
  Axios.interceptors.request.use(
    function(config) {
      return config;
    },
    function(error: AxiosError) {
      return Promise.reject(error);
    }
  );

  Axios.interceptors.response.use(
    function(response) {
      return response;
    },
    function(error: AxiosError) {
      if (
        error.response?.status === 401 ||
        error.response?.status === 403 ||
        (error.response?.status === 400 &&
          error.response.data === 'error:token_expired')
      ) {
        rootStore.accountStore.cancelRetries();
        rootStore.routeStore.redirect('/login', 'error:token_expired');
      }
      return Promise.reject(error);
    }
  );
}

export default configureAxios;

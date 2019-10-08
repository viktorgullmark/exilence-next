import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import { sessionReducer } from './session/reducers';
import * as sessionActions from './session/actions';
import sessionSagas from './session/sagas';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga'
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import localForage from 'localforage';

const rootReducer = combineReducers({
  session: sessionReducer
});

export type AppState = ReturnType<typeof rootReducer>;

const enhancers = [];
const middleware = [];

// logging middleware, only use in dev
if (process.env.NODE_ENV === 'development') {
  const logger = createLogger({
    level: 'info',
    collapsed: true
  });

  middleware.push(logger);
}

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();

middleware.push(sagaMiddleware);

// pass all actions to redux devtools
const actionCreators = {
  ...sessionActions
};

// if redux devtools is installed and is in dev mode, use it
/* eslint-disable no-underscore-dangle */
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ && process.env.NODE_ENV === 'development'
  ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    actionCreators
  })
  : compose;
/* eslint-enable no-underscore-dangle */

enhancers.push(applyMiddleware(...middleware));
const enhancer = composeEnhancers(...enhancers);

export default function configureStore() {

  localForage.config({
    name: 'exilence-next-db',
    driver: localForage.INDEXEDDB,
  });

  const persistConfig = {
    key: 'root',
    storage: localForage
  }
  
  const persistedReducer = persistReducer(persistConfig, rootReducer)

  const store = createStore(
    persistedReducer,
    enhancer
  );

  const persistor = persistStore(store);

  sagaMiddleware.run(sessionSagas);

  return { store, persistor };
}

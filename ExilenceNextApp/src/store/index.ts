import localForage from 'localforage';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { persistReducer, persistStore } from 'redux-persist';
import * as sessionActions from './session/actions';
import sessionEpic from './session/epics';
import { sessionReducer } from './session/reducers';
import { ActionType } from 'typesafe-actions';

export const RootReducer = combineReducers({
  session: sessionReducer
});

export type AppState = ReturnType<typeof RootReducer>;

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

// pass all actions to redux devtools
export const ActionCreators = {
  ...sessionActions
};

const epics = combineEpics(
  ...sessionEpic,
);

// create the epic middleware
const epicMiddleware = createEpicMiddleware<ActionType<typeof ActionCreators>, ActionType<typeof ActionCreators>, AppState>();

middleware.push(epicMiddleware);

// if redux devtools is installed and is in dev mode, use it
/* eslint-disable no-underscore-dangle */
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ && process.env.NODE_ENV === 'development'
  ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    ActionCreators
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

  const persistedReducer = persistReducer(persistConfig, RootReducer)

  const store = createStore(
    persistedReducer,
    enhancer
  );

  const persistor = persistStore(store);

  epicMiddleware.run(epics);

  return { store, persistor };
}



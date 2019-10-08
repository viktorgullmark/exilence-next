import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import { sessionReducer } from './session/reducers';
import * as sessionActions from './session/actions';
import sessionSagas from './session/sagas';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga'

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

  const store = createStore(
    rootReducer,
    enhancer
  );

  sagaMiddleware.run(sessionSagas);

  return store;
}

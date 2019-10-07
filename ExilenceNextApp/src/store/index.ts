import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import { sessionReducer } from './session/reducers';
import * as sessionActions from './session/actions';
import { createLogger } from 'redux-logger';

const rootReducer = combineReducers({
  session: sessionReducer
});

export type AppState = ReturnType<typeof rootReducer>;

const enhancers = [];
const middleware = [];

// Logging Middleware
const logger = createLogger({
  level: 'info',
  collapsed: true
});

middleware.push(logger);

// Redux DevTools Configuration
const actionCreators = {
  ...sessionActions
};

// If Redux DevTools Extension is installed use it, otherwise use Redux compose
/* eslint-disable no-underscore-dangle */
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    // Options: http://extension.remotedev.io/docs/API/Arguments.html
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

  return store;
}

import { httpListener } from '@marblejs/core';
import { bodyParser$ } from '@marblejs/middleware-body';
import { logger$ } from '@marblejs/middleware-logger';
import { api$ } from './api.effects';

const middlewares = [
  logger$(),
  bodyParser$(),
  // ...
];

const effects = [
  api$,
  // endpoint2$
  // ...
];

export default httpListener({ middlewares, effects });
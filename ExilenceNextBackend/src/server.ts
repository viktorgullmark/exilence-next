import { createServer } from '@marblejs/core';
import httpListener from './http.listener';

export const server = createServer({
  port: 3001,
  hostname: '127.0.0.1',
  httpListener,
});

server.run();
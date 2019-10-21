import { HttpRequest, r, RouteEffect } from '@marblejs/core';
import { mapTo } from 'rxjs/operators';

export const api$: RouteEffect<HttpRequest> = r.pipe(
  r.matchPath('/'),
  r.matchType('GET'),
  r.useEffect(req$ => req$.pipe(
    mapTo({ body: 'Hello, world!!!!' }),
  )));
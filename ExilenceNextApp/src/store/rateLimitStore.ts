import { action, makeObservable } from 'mobx';
import { rateLimit } from '../utils/rxjs.utils';
import { RootStore } from './rootStore';

interface IRateLimitBoundaries {
  requests: number;
  interval: number;
}

// prio: fix snapshotting since we return different array

// todo: parse remaining requests until limit
// todo: parse remaining time on current limit
// todo: test timer for limits

export class RateLimitStore {
  rateLimiter1 = rateLimit(13, 10 * 1000);
  rateLimiter2 = rateLimit(27, 300 * 1000);

  constructor(private rootStore: RootStore) {
    makeObservable(this);
  }

  @action
  setRateLimiter1(limit: IRateLimitBoundaries) {
    // todo: only update when needed
  }

  @action
  setRateLimiter2(limit: IRateLimitBoundaries) {
    // todo: update headers when needed
  }

  @action
  parseRateLimitHeaders(headers: string) {
    if (headers) {
      const _inner = headers.split(',').shift()?.split(':');
      if (_inner && _inner.length > 0) {
        const _requests = _inner[0];
        const _interval = _inner[1];
        this.setRateLimiter1({
          requests: +_requests - +_requests * 0.2,
          interval: +_interval * 1000,
        });
      }
      const _outer = headers.split(',').pop()?.split(':');
      if (_outer && _outer.length > 0) {
        const _requests = _outer[0];
        const _interval = _outer[1];
        this.setRateLimiter2({
          requests: +_requests - +_requests * 0.2,
          interval: +_interval * 1000,
        });
      }
    }
  }
}

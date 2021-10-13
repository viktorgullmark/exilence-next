import { RateLimiter } from 'limiter';
import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { persist } from 'mobx-persist';
import { rateLimit } from '../utils/rxjs.utils';
import { RootStore } from './rootStore';

interface IRateLimitBoundaries {
  requests: number;
  interval: number;
}

const rateLimiter1Defaults: IRateLimitBoundaries = {
  requests: 14,
  interval: 11 * 1000,
};

const rateLimiter2Defaults: IRateLimitBoundaries = {
  requests: 29,
  interval: 301 * 1000,
};

export class RateLimitStore {
  @observable outer?: RateLimiter;
  @observable inner?: RateLimiter;

  @observable rateLimiter1limits = rateLimiter1Defaults;
  @observable rateLimiter2limits = rateLimiter2Defaults;
  @observable shouldUpdateLimits = false;
  @observable retryAfter = 0;
  @persist('object') @observable lastRequestTimestamp?: Date;
  @observable rateLimiter1 = rateLimit(
    this.rateLimiter1limits.requests,
    this.rateLimiter1limits.interval
  );
  @observable rateLimiter2 = rateLimit(
    this.rateLimiter2limits.requests,
    this.rateLimiter2limits.interval
  );

  constructor(private rootStore: RootStore) {
    makeObservable(this);
  }

  @action createInner(tokensConsumed: number = 0) {
    console.log('creating inner with tokens', 14 - tokensConsumed);
    this.inner = new RateLimiter({
      tokensPerInterval: 14 - tokensConsumed,
      interval: 12000,
    });
    return this.inner;
  }

  @action createOuter(tokensConsumed: number = 0) {
    console.log('creating outer with tokens', 29 - tokensConsumed);
    this.outer = new RateLimiter({
      tokensPerInterval: 29 - tokensConsumed,
      interval: 312000,
    });
    return this.outer;
  }

  @action
  setRateLimiter1(limit: IRateLimitBoundaries) {
    this.rateLimiter1 = rateLimit(limit.requests, limit.interval);
  }

  @action
  setRateLimiter2(limit: IRateLimitBoundaries) {
    this.rateLimiter2 = rateLimit(limit.requests, limit.interval);
  }

  @action
  setRetryAfter(seconds: number) {
    this.retryAfter = seconds === 0 ? 0 : new Date().setSeconds(new Date().getSeconds() + seconds);
  }

  @action
  setLastRequestTimestamp(timestamp: Date) {
    this.lastRequestTimestamp = timestamp;
  }

  @action
  getTokensConsumedInState(headers: string) {
    let innerTokens = 0;
    let outerTokens = 0;
    if (headers) {
      const _inner = headers.split(',').shift()?.split(':');
      if (_inner && _inner.length > 0) {
        innerTokens = +_inner[0];
      }
      const _outer = headers.split(',').pop()?.split(':');
      if (_outer && _outer.length > 0) {
        outerTokens = +_outer[0];
      }
    }
    return { innerTokens, outerTokens };
  }

  @action
  updateLimits() {
    this.setRateLimiter1(this.rateLimiter1limits);
    this.setRateLimiter2(this.rateLimiter2limits);
    runInAction(() => {
      this.shouldUpdateLimits = false;
    });
  }
}

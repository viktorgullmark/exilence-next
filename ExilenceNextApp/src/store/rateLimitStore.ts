import { action, makeObservable, observable, runInAction } from 'mobx';
import { persist } from 'mobx-persist';
import { rateLimit } from '../utils/rxjs.utils';
import { RootStore } from './rootStore';

interface IRateLimitBoundaries {
  requests: number;
  interval: number;
}

const rateLimiter1Defaults: IRateLimitBoundaries = {
  requests: 13,
  interval: 13 * 1000,
};

const rateLimiter2Defaults: IRateLimitBoundaries = {
  requests: 26,
  interval: 310 * 1000,
};

export class RateLimitStore {
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
  parseRateLimitHeaders(headers: string) {
    if (headers) {
      const _inner = headers.split(',').shift()?.split(':');
      if (_inner && _inner.length > 0) {
        const _requests = +_inner[0] - 2;
        const _interval = (+_inner[1] + 3) * 1000;
        if (
          _requests !== this.rateLimiter1limits.requests ||
          _interval !== this.rateLimiter1limits.interval
        ) {
          runInAction(() => {
            this.shouldUpdateLimits = true;
            this.rateLimiter1limits = { requests: _requests, interval: _interval };
          });
        }
      }
      const _outer = headers.split(',').pop()?.split(':');
      if (_outer && _outer.length > 0) {
        const _requests = +_outer[0] - 4;
        const _interval = (+_outer[1] + 10) * 1000;
        if (
          _requests !== this.rateLimiter2limits.requests ||
          _interval !== this.rateLimiter2limits.interval
        ) {
          runInAction(() => {
            this.shouldUpdateLimits = true;
            this.rateLimiter2limits = { requests: _requests, interval: _interval };
          });
        }
      }
    }
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

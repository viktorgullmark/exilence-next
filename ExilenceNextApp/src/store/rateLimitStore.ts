import { RateLimiter } from 'limiter';
import { action, makeObservable, observable } from 'mobx';
import { persist } from 'mobx-persist';
import { RootStore } from './rootStore';

interface IRateLimitStateGroup {
  inner: IRateLimitState;
  outer: IRateLimitState;
}

interface IRateLimitState {
  tokens: number;
  interval: number;
}

export class RateLimitStore {
  @observable outer?: RateLimiter;
  @observable inner?: RateLimiter;

  @observable retryAfter = 0;
  @persist('object') @observable lastRequestTimestamp?: Date;
  @persist('object') @observable lastRateLimitState?: IRateLimitStateGroup;
  @persist('object') @observable lastRateLimitBoundaries?: IRateLimitStateGroup;

  constructor(private rootStore: RootStore) {
    makeObservable(this);
  }

  @action createInner(tokensConsumed: number = 0, requests: number, interval: number) {
    const tokensToUse = requests - tokensConsumed;
    this.inner = new RateLimiter({
      tokensPerInterval: tokensToUse < 1 ? 1 : tokensToUse,
      interval: interval,
    });
    return this.inner;
  }

  @action createOuter(tokensConsumed: number = 0, requests: number, interval: number) {
    const tokensToUse = requests - tokensConsumed;
    this.outer = new RateLimiter({
      tokensPerInterval: tokensToUse < 1 ? 1 : tokensToUse,
      interval: interval,
    });
    return this.outer;
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
  setLastRateLimitState(state: IRateLimitStateGroup) {
    this.lastRateLimitState = state;
  }

  @action
  setLastRateLimitBoundaries(state: IRateLimitStateGroup) {
    this.lastRateLimitBoundaries = state;
  }

  @action
  getLimitsFromHeaders(headers: string) {
    const inner = { tokens: 0, interval: 0 };
    const outer = { tokens: 0, interval: 0 };
    if (headers) {
      const _inner = headers.split(',').shift()?.split(':');
      if (_inner && _inner.length > 0) {
        const tokens = +_inner[0] - 3;
        inner.tokens = tokens < 0 ? 0 : tokens;
        inner.interval = (+_inner[1] + 2) * 1000;
      }
      const _outer = headers.split(',').pop()?.split(':');
      if (_outer && _outer.length > 0) {
        const tokens = +_outer[0] - 2;
        outer.tokens = tokens < 0 ? 0 : tokens;
        outer.interval = (+_outer[1] + 12) * 1000;
      }
    }
    return {
      inner,
      outer,
    };
  }

  @action
  getStateFromHeaders(headers: string) {
    const inner = { tokens: 0, interval: 0 };
    const outer = { tokens: 0, interval: 0 };
    if (headers) {
      const _inner = headers.split(',').shift()?.split(':');
      if (_inner && _inner.length > 0) {
        const tokens = +_inner[0];
        inner.tokens = tokens < 0 ? 0 : tokens;
        inner.interval = (+_inner[1] + 2) * 1000;
      }
      const _outer = headers.split(',').pop()?.split(':');
      if (_outer && _outer.length > 0) {
        const tokens = +_outer[0];
        outer.tokens = tokens < 0 ? 0 : tokens;
        outer.interval = (+_outer[1] + 12) * 1000;
      }
    }
    return {
      inner,
      outer,
    };
  }
}

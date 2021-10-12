import Bottleneck from 'bottleneck';
import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { persist } from 'mobx-persist';
import { RootStore } from './rootStore';

const options1 = {
  reservoir: 29,
  reservoirRefreshAmount: 29,
  reservoirRefreshInterval: 310 * 1000,
  maxConcurrent: 1,
  minTime: 500,
};

const options2 = {
  reservoir: 13,
  reservoirRefreshAmount: 13,
  reservoirRefreshInterval: 12 * 1000,
  maxConcurrent: 1,
  minTime: 500,
};

export class RateLimitStore {
  @observable bottleneck?: Bottleneck;
  @observable shouldUpdateLimits = false;
  @observable retryAfter = 0;
  @persist('object') @observable lastRequestTimestamp?: Date;

  constructor(private _: RootStore) {
    makeObservable(this);
  }

  @computed
  get getBottleneck() {
    if (this.bottleneck) {
      return this.bottleneck;
    }
    const outer = new Bottleneck(options1);
    const inner = new Bottleneck(options2);
    this.bottleneck = outer.chain(inner);
    console.log('creating bottleneck!', this.bottleneck);
    return this.bottleneck;
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
        const _requests = +_inner[0] - 1;
        const _interval = (+_inner[1] + 1) * 1000;
        if (_requests !== options2.reservoir || _interval !== options2.reservoirRefreshInterval) {
          runInAction(() => {
            this.shouldUpdateLimits = true;
            // todo: update options
          });
        }
      }
      const _outer = headers.split(',').pop()?.split(':');
      if (_outer && _outer.length > 0) {
        const _requests = +_outer[0] - 1;
        const _interval = (+_outer[1] + 1) * 1000;
        if (_requests !== options2.reservoir || _interval !== options2.reservoirRefreshInterval) {
          runInAction(() => {
            this.shouldUpdateLimits = true;
            // todo: update options
          });
        }
      }
    }
  }

  @action
  updateLimits() {
    // todo: update limits
    runInAction(() => {
      this.shouldUpdateLimits = false;
    });
  }
}

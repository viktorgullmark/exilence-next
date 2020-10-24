import { action, makeObservable, observable } from 'mobx';
import { persist } from 'mobx-persist';

import { electronService } from '../services/electron.service';
import { RootStore } from './rootStore';

export class SettingStore {
  @persist @observable lowConfidencePricing: boolean = false;
  @persist @observable autoSnapshotting: boolean = true;
  @persist @observable priceTreshold: number = 0;
  @persist @observable totalPriceTreshold: number = 0;
  @persist @observable autoSnapshotInterval: number = 60 * 2 * 1000; // default to 2 minutes
  @persist
  @observable
  uiScale: number = electronService.webFrame.getZoomFactor() * 100;
  @persist @observable logPath: string =
    'C:/Program Files (x86)/Grinding Gear Games/Path of Exile/logs/Client.txt';

  constructor(private rootStore: RootStore) {
    makeObservable(this);
  }

  @action
  setUiScale(factor: number | string | number[]) {
    if (typeof factor === 'string') {
      return;
    }
    if (Array.isArray(factor)) {
      factor = factor[factor.length - 1];
    }
    this.uiScale = factor;
    electronService.webFrame.setZoomFactor(factor / 100);
  }

  @action
  setLowConfidencePricing(value: boolean) {
    this.lowConfidencePricing = value;
  }

  @action
  setAutoSnapshotting(value: boolean) {
    if (!value) {
      this.rootStore.accountStore.getSelectedAccount.dequeueSnapshot();
    } else {
      this.rootStore.accountStore.getSelectedAccount.queueSnapshot();
    }
    this.autoSnapshotting = value;
  }

  @action
  setPriceTreshold(value: number) {
    this.priceTreshold = value;
  }

  @action
  setTotalPriceTreshold(value: number) {
    this.totalPriceTreshold = value;
  }

  @action
  setAutoSnapshotInterval(value: number) {
    this.autoSnapshotInterval = value * 60 * 1000;
    this.rootStore.accountStore.getSelectedAccount.dequeueSnapshot();
    this.rootStore.accountStore.getSelectedAccount.queueSnapshot();
  }

  @action
  setLogPath(path: string) {
    this.logPath = path;
  }
}

import { action, computed, makeObservable, observable } from 'mobx';
import { persist } from 'mobx-persist';
import { ICurrency } from '../interfaces/currency.interface';

import { electronService } from '../services/electron.service';
import { RootStore } from './rootStore';

export class SettingStore {
  @persist @observable lowConfidencePricing: boolean = false;
  @persist @observable autoSnapshotting: boolean = true;
  @persist @observable isHardwareAccelerationEnabled: boolean =
    electronService.localSettings?.isHardwareAccelerationEnabled || true;
  @persist @observable priceThreshold: number = 0;
  @persist @observable totalPriceThreshold: number = 0;
  @persist @observable showPriceInExalt = false;
  @persist @observable autoSnapshotInterval: number = 60 * 2 * 1000; // default to 2 minutes
  @persist
  @observable
  uiScale: number = electronService.webFrame.getZoomFactor() * 100;
  @persist @observable logPath: string =
    'C:/Program Files (x86)/Grinding Gear Games/Path of Exile/logs/Client.txt';

  constructor(private rootStore: RootStore) {
    makeObservable(this);
  }

  @computed get activeCurrency(): ICurrency {
    return this.showPriceInExalt ? { name: 'exalted', short: 'ex' } : { name: 'chaos', short: 'c' };
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
  setShowPriceInExalt(value: boolean) {
    this.showPriceInExalt = value;
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
  setHardwareAcceleration(value: boolean) {
    this.isHardwareAccelerationEnabled = value;
    electronService.ipcRenderer.send('hardware-acceleration', value);
  }

  @action
  setPriceThreshold(value: number) {
    this.priceThreshold = value;
  }

  @action
  setTotalPriceThreshold(value: number) {
    this.totalPriceThreshold = value;
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

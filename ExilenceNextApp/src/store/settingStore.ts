import { action, computed, makeObservable, observable } from 'mobx';
import { persist } from 'mobx-persist';
import { rootStore } from '..';
import { ICurrency } from '../interfaces/currency.interface';

import { electronService } from '../services/electron.service';
import { RootStore } from './rootStore';

export type ReleaseChannel = 'latest' | 'beta';
export type Currency = 'chaos' | 'exalt' | 'divine';
export type AppExitTypes = 'minimize-to-tray' | 'exit';

export class SettingStore {
  @persist @observable lowConfidencePricing: boolean = false;
  @persist @observable autoSnapshotting: boolean = false;
  @persist @observable isHardwareAccelerationEnabled: boolean =
    electronService.localSettings?.isHardwareAccelerationEnabled || true;
  @persist @observable releaseChannel: ReleaseChannel =
    electronService.localSettings?.releaseChannel || 'latest';
  @persist @observable priceThreshold: number = 0;
  @persist @observable totalPriceThreshold: number = 0;
  @persist @observable currency: Currency = 'chaos';
  @persist @observable autoSnapshotInterval: number = 60 * 20 * 1000; // default to 20 minutes
  @persist @observable uiScale: number = electronService.webFrame.getZoomFactor() * 100;
  @persist @observable logPath: string =
    'C:/Program Files (x86)/Grinding Gear Games/Path of Exile/logs/Client.txt';
  @persist @observable appExitAction: AppExitTypes =
    electronService.localSettings?.appExitAction || 'minimize-to-tray';

  constructor(private rootStore: RootStore) {
    makeObservable(this);
  }

  @computed get activeCurrency(): ICurrency {
    switch (this.currency) {
      case 'exalt':
        return { name: 'exalted', short: 'ex' };
      case 'chaos':
        return { name: 'chaos', short: 'c' };
      case 'divine':
        return { name: 'divine', short: 'div' };
    }
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
  setCurrencyDisplay(value: Currency) {
    this.currency = value;
    rootStore.accountStore.getSelectedAccount?.activeProfile?.updateNetWorthOverlay();
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
  setReleaseChannel(value: ReleaseChannel) {
    this.releaseChannel = value;
    electronService.ipcRenderer.send('release-channel', value);
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

  @action
  setAppExitAction(appExitAction: AppExitTypes) {
    this.appExitAction = appExitAction;
    electronService.ipcRenderer.send('app-exit-action', appExitAction);
  }
}

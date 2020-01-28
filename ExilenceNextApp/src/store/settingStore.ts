import { action, observable } from 'mobx';
import { persist } from 'mobx-persist';
import { ISelectOption } from '../interfaces/select-option.interface';
import { SettingUtils } from '../utils/setting.utils';
import { stores } from '..';
import { electronService } from '../services/electron.service';

export class SettingStore {
  @persist @observable lowConfidencePricing: boolean = false;
  @persist @observable autoSnapshotting: boolean = false;
  @persist @observable priceTreshold: number = 0;
  @persist @observable autoSnapshotInterval: number = 60 * 5 * 1000; // default to 5 minutes
  @persist
  @observable
  uiScale: number = electronService.webFrame.getZoomFactor() * 100;

  priceTresholdOptions: ISelectOption[] = SettingUtils.getPriceTresholdOptions();

  constructor() {
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
      stores.accountStore.getSelectedAccount.dequeueSnapshot();
    } else {
      stores.accountStore.getSelectedAccount.queueSnapshot();
    }
    this.autoSnapshotting = value;
  }

  @action
  setPriceTreshold(value: number) {
    this.priceTreshold = value;
  }

  @action
  setAutoSnapshotInterval(value: number) {
    this.autoSnapshotInterval = value * 60 * 1000;
    stores.accountStore.getSelectedAccount.dequeueSnapshot();
    stores.accountStore.getSelectedAccount.queueSnapshot();
  }
}

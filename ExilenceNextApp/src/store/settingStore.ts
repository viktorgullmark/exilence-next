import { action, observable } from 'mobx';
import { persist } from 'mobx-persist';
import { ISelectOption } from '../interfaces/select-option.interface';
import { SettingUtils } from '../utils/setting.utils';

export class SettingStore {

  @persist @observable lowConfidencePricing: boolean = false;
  @persist @observable autoSnapshotting: boolean = true;
  @persist @observable priceTreshold: number = 1;
  @persist @observable autoSnapshotInterval: number = 60 * 5 * 1000; // default to 5 minutes

  priceTresholdOptions: ISelectOption[] = SettingUtils.getPriceTresholdOptions();

  constructor() {
  }

  @action
  setLowConfidencePricing(value: boolean) {
    this.lowConfidencePricing = value;
  }

  @action
  setAutoSnapshotting(value: boolean) {
    this.autoSnapshotting = value;
  }

  @action
  setPriceTreshold(value: number) {
    this.priceTreshold = value;
  }

  @action
  setAutoSnapshotInterval(value: number) {
    this.autoSnapshotInterval = value * 60 * 1000;
  }
}

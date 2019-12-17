import { action, observable } from 'mobx';
import { persist } from 'mobx-persist';
import { ISelectOption } from '../interfaces/select-option.interface';
import { SettingUtils } from '../utils/setting.utils';

export class SettingStore {

  @persist @observable lowConfidencePricing: boolean = false;
  @persist @observable priceTreshold: number = 1;

  priceTresholdOptions: ISelectOption[] = SettingUtils.getPriceTresholdOptions();

  constructor() {
  }

  @action
  setLowConfidencePricing(value: boolean) {
    this.lowConfidencePricing = value;
  }

  @action
  setPriceTreshold(value: number) {
    this.priceTreshold = value;
  }
}

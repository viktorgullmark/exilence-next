import React from 'react';
import { inject, observer } from 'mobx-react';

import { SettingStore } from '../../../store/settingStore';
import NetWorthSettings from './NetWorthSettings';

type NetWorthSettingsContainerProps = {
  settingStore?: SettingStore;
};

const NetWorthSettingsContainer = ({ settingStore }: NetWorthSettingsContainerProps) => {
  return (
    <NetWorthSettings
      lowConfidencePricing={settingStore!.lowConfidencePricing}
      priceTreshold={settingStore!.priceTreshold}
      totalPriceTreshold={settingStore!.totalPriceTreshold}
      setPriceTreshold={(value: number) => settingStore!.setPriceTreshold(value)}
      setTotalPriceTreshold={(value: number) => settingStore!.setTotalPriceTreshold(value)}
      setLowConfidencePricing={(value: boolean) => settingStore!.setLowConfidencePricing(value)}
    />
  );
};

export default inject('settingStore')(observer(NetWorthSettingsContainer));

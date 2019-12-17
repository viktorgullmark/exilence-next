import { inject, observer } from 'mobx-react';
import React from 'react';
import { SettingStore } from '../../../store/settingStore';
import NetWorthSettings from './NetWorthSettings';

interface Props {
  settingStore?: SettingStore;
}

const NetWorthSettingsContainer: React.FC<Props> = ({
  settingStore
}: Props) => {
  return (
    <NetWorthSettings
      lowConfidencePricing={settingStore!.lowConfidencePricing}
      priceTreshold={settingStore!.priceTreshold}
      setPriceTreshold={(value: number) => settingStore!.setPriceTreshold(value)}
      setLowConfidencePricing={(value: boolean) => settingStore!.setLowConfidencePricing(value)}
      priceTresholdOptions={settingStore!.priceTresholdOptions}
    />
  );
};

export default inject('settingStore')(observer(NetWorthSettingsContainer));

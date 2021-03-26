import React from 'react';
import { Grid } from '@material-ui/core';
import { inject, observer } from 'mobx-react';

import CheckboxSetting from '../../components/checkbox-setting/CheckboxSetting';
import NumberInputSetting from '../../components/number-input-setting/NumberInputSetting';
import { SettingStore } from '../../../../store/settingStore';

type NetWorthSettingsProps = {
  settingStore?: SettingStore;
};
const NetWorthSettings = ({ settingStore }: NetWorthSettingsProps) => (
  <Grid container spacing={5}>
    <Grid item>
      <CheckboxSetting
        value={settingStore!.lowConfidencePricing}
        handleChange={(value: boolean) => settingStore!.setLowConfidencePricing(value)}
        translationKey="low_confidence_pricing"
        requiresSnapshot
      />
    </Grid>
    <Grid item>
      <NumberInputSetting
        value={settingStore!.priceTreshold}
        handleChange={(value: number) => settingStore!.setPriceTreshold(value)}
        translationKey="price_treshold"
        minimum={0}
        maximum={100}
        suffixKey="unit.chaos"
        requiresSnapshot
      />
    </Grid>
    <Grid item>
      <NumberInputSetting
        value={settingStore!.totalPriceTreshold}
        handleChange={(value: number) => settingStore!.setTotalPriceTreshold(value)}
        translationKey="total_price_treshold"
        minimum={0}
        maximum={5000}
        suffixKey="unit.chaos"
        requiresSnapshot
      />
    </Grid>
  </Grid>
);

export default inject('settingStore')(observer(NetWorthSettings));

import React from 'react';
import { Grid } from '@material-ui/core';
import { inject, observer } from 'mobx-react';

import CheckboxSetting from '../../components/checkbox-setting/CheckboxSetting';
import { SettingStore } from '../../../../store/settingStore';

type HardwareAccelerationSettingsProps = {
  settingStore?: SettingStore;
};
const HardwareAccelerationSettings = ({ settingStore }: HardwareAccelerationSettingsProps) => (
  <Grid container spacing={5}>
    <Grid item>
      <CheckboxSetting
        value={settingStore!.isHardwareAccelerationEnabled}
        handleChange={(value: boolean) => settingStore!.setHardwareAcceleration(value)}
        labelKey="enable_hardware_acceleration"
        translationKey="hardware_acceleration"
      />
    </Grid>
  </Grid>
);

export default inject('settingStore')(observer(HardwareAccelerationSettings));

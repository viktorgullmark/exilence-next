import { Grid } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStores } from '../../../..';
import CheckboxSetting from '../../components/checkbox-setting/CheckboxSetting';

const HardwareAccelerationSettings = () => {
  const { settingStore } = useStores();
  return (
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
};

export default observer(HardwareAccelerationSettings);

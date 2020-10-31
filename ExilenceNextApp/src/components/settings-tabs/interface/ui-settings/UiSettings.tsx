import React from 'react';
import { Grid } from '@material-ui/core';
import { inject, observer } from 'mobx-react';

import SliderSetting from '../../components/slider-setting/SliderSetting';
import { SettingStore } from '../../../../store/settingStore';

type UiSettingsProps = {
  settingStore?: SettingStore;
};

const UiSettings = ({ settingStore }: UiSettingsProps) => (
  <Grid container spacing={5}>
    <Grid item>
      <SliderSetting
        value={settingStore!.uiScale}
        handleChange={(value: number | string | number[]) => settingStore!.setUiScale(value)}
        translationKey={'ui_scale'}
      />
    </Grid>
  </Grid>
);

export default inject('settingStore')(observer(UiSettings));

import { Grid } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStores } from '../../../..';
import SliderSetting from '../../components/slider-setting/SliderSetting';

const UiSettings = () => {
  const { settingStore } = useStores();
  return (
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
};

export default observer(UiSettings);

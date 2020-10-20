import React, { ChangeEvent } from 'react';
import { Grid } from '@material-ui/core';
import { observer } from 'mobx-react';

import SliderSetting from '../slider-setting/SliderSetting';

type UiSettingsProps = {
  uiScale: number;
  setUiScale: (event: ChangeEvent<{}> | MouseEvent, value: number | string | number[]) => void;
};

const UiSettings = ({ uiScale, setUiScale }: UiSettingsProps) => {
  return (
    <Grid container spacing={5}>
      <Grid item>
        <SliderSetting value={uiScale} handleChange={setUiScale} translationKey={'ui_scale'} />
      </Grid>
    </Grid>
  );
};

export default observer(UiSettings);

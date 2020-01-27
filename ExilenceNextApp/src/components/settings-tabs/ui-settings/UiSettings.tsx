import { Grid } from '@material-ui/core';
import { observer } from 'mobx-react';
import React, { ChangeEvent } from 'react';
import SliderSetting from '../slider-setting/SliderSetting';

interface Props {
  uiScale: number;
  setUiScale: (event: ChangeEvent<{}> | MouseEvent, value: number | string | number[]) => void;
}

const UiSettings: React.FC<Props> = ({
  uiScale,
  setUiScale
}: Props) => {

  return (
    <Grid container spacing={2}>   
      <Grid item xs={12} sm={3}>
        <SliderSetting value={uiScale} handleChange={setUiScale} waitForMouseUp translationKey={'ui_scale'} />
      </Grid>
    </Grid>
  );
};

export default observer(UiSettings);

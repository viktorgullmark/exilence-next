import React from 'react';
import { Grid } from '@mui/material';
import { observer } from 'mobx-react-lite';

import TextInputSetting from '../text-input-setting/TextInputSetting';

type LogSettingsProps = {
  path: string;
  setLogPath: (value: string) => void;
};

const LogSettings = ({ path, setLogPath }: LogSettingsProps) => (
  <Grid container spacing={2}>
    <Grid item xs={12} sm={3}>
      <TextInputSetting value={path} handleChange={setLogPath} translationKey={'log_path'} />
    </Grid>
  </Grid>
);

export default observer(LogSettings);

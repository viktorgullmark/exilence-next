import { Grid } from '@material-ui/core';
import { observer } from 'mobx-react';
import React, { ChangeEvent } from 'react';
import TextInputSetting from '../text-input-setting/TextInputSetting';

interface Props {
  path: string;
  setLogPath: (value: string) => void;
}

const LogSettings: React.FC<Props> = ({ path, setLogPath }: Props) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={3}>
        {
          <TextInputSetting
            value={path}
            handleChange={setLogPath}
            translationKey={'log_path'}
          />
        }
      </Grid>
    </Grid>
  );
};

export default observer(LogSettings);

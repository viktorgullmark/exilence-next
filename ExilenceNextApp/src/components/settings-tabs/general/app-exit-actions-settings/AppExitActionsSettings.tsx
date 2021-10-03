import { Grid } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStores } from '../../../..';
import SelectSetting from '../../components/select-setting/SelectSetting';
import { AppExitTypes } from '../../../../store/settingStore';

const APP_EXIT_ACTIONS = [
  {
    label: 'Minimize Exilence Next to the system tray',
    value: 'minimize-to-tray',
    id: 'minimize-to-tray',
  },
  { label: 'Exit Exilence Next completely', value: 'exit', id: 'exit' },
];

const AppExitActionsSettings = () => {
  const { settingStore } = useStores();
  return (
    <Grid container spacing={5}>
      <Grid item>
        <SelectSetting
          value={settingStore!.appExitAction}
          options={APP_EXIT_ACTIONS}
          handleChange={(value: AppExitTypes) => settingStore!.setAppExitAction(value)}
          translationKey="app_exit_actions"
          withNone={false}
          maxWidth={340}
        />
      </Grid>
    </Grid>
  );
};

export default observer(AppExitActionsSettings);

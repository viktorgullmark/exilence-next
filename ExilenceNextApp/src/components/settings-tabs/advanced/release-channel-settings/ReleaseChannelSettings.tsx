import { Grid } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStores } from '../../../..';
import SelectSetting from '../../components/select-setting/SelectSetting';

const RELEASE_CHANNELS = [
  { label: 'latest', value: 0, id: 'latest' },
  { label: 'beta', value: 1, id: 'beta' },
];

const ReleaseChannelSettings = () => {
  const { settingStore } = useStores();
  return (
    <Grid container spacing={5}>
      <Grid item>
        <SelectSetting
          value={settingStore!.releaseChannel}
          options={RELEASE_CHANNELS}
          handleChange={(value: number) => settingStore!.setReleaseChannel(value)}
          translationKey="release_channel"
          withNone={false}
        />
      </Grid>
    </Grid>
  );
};

export default observer(ReleaseChannelSettings);

import { Grid } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStores } from '../../../..';
import SelectSetting from '../../components/select-setting/SelectSetting';
import { ReleaseChannel } from '../../../../store/settingStore';

const RELEASE_CHANNELS = [
  { label: 'Latest Stable', value: 'latest', id: 'latest' },
  { label: 'Beta', value: 'beta', id: 'beta' },
];

const ReleaseChannelSettings = () => {
  const { settingStore } = useStores();
  return (
    <Grid container spacing={5}>
      <Grid item>
        <SelectSetting
          value={settingStore!.releaseChannel}
          options={RELEASE_CHANNELS}
          handleChange={(value: ReleaseChannel) => settingStore!.setReleaseChannel(value)}
          translationKey="release_channel"
          withNone={false}
        />
      </Grid>
    </Grid>
  );
};

export default observer(ReleaseChannelSettings);

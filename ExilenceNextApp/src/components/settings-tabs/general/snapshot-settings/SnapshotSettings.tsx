import { Grid } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStores } from '../../../..';
import CheckboxSetting from '../../components/checkbox-setting/CheckboxSetting';
import NumberInputSetting from '../../components/number-input-setting/NumberInputSetting';

const SnapshotSettings = () => {
  const { settingStore } = useStores();
  return (
    <Grid container spacing={5}>
      <Grid item>
        <CheckboxSetting
          value={settingStore!.autoSnapshotting}
          handleChange={(value: boolean) => settingStore!.setAutoSnapshotting(value)}
          translationKey="auto_snapshotting"
        />
      </Grid>
      <Grid item>
        <NumberInputSetting
          value={settingStore!.autoSnapshotInterval / 1000 / 60}
          handleChange={(value: number) => settingStore!.setAutoSnapshotInterval(value)}
          translationKey="auto_snapshot_interval"
          disabled={!settingStore!.autoSnapshotting}
          minimum={5}
          maximum={1000}
          suffixKey="unit.minute"
        />
      </Grid>
    </Grid>
  );
};
export default observer(SnapshotSettings);

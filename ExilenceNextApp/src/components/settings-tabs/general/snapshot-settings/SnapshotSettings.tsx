import React from 'react';
import { Grid } from '@material-ui/core';
import { inject, observer } from 'mobx-react';

import CheckboxSetting from '../../components/checkbox-setting/CheckboxSetting';
import NumberInputSetting from '../../components/number-input-setting/NumberInputSetting';
import { SettingStore } from '../../../../store/settingStore';

type SnapshotSettingsProps = {
  settingStore?: SettingStore;
};

const SnapshotSettings = ({ settingStore }: SnapshotSettingsProps) => (
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
        minimum={2}
        maximum={1000}
        suffixKey="unit.minute"
      />
    </Grid>
  </Grid>
);

export default inject('settingStore')(observer(SnapshotSettings));

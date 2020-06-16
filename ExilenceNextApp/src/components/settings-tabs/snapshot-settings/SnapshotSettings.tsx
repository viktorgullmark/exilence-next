import { Grid } from '@material-ui/core';
import { observer } from 'mobx-react';
import React from 'react';
import CheckboxSetting from '../checkbox-setting/CheckboxSetting';
import NumberInputSetting from '../number-input-setting/NumberInputSetting';

interface Props {
  autoSnapshotting: boolean;
  autoSnapshotInterval: number;
  setAutoSnapshotInterval: (value: number) => void;
  setAutoSnapshotting: (value: boolean) => void;
}

const SnapshotSettings: React.FC<Props> = ({
  autoSnapshotting,
  setAutoSnapshotting,
  autoSnapshotInterval,
  setAutoSnapshotInterval,
}: Props) => {
  return (
    <Grid container spacing={5}>
      <Grid item>
        <CheckboxSetting
          value={autoSnapshotting}
          handleChange={setAutoSnapshotting}
          translationKey='auto_snapshotting'
        />
      </Grid>
      <Grid item>
        <NumberInputSetting
          value={autoSnapshotInterval / 1000 / 60}
          handleChange={setAutoSnapshotInterval}
          translationKey='auto_snapshot_interval'
          disabled={!autoSnapshotting}
          minimum={2}
          maximum={1000}
          suffixKey='unit.minute'
        />
      </Grid>
    </Grid>
  );
};

export default observer(SnapshotSettings);

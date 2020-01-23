import { Grid } from '@material-ui/core';
import { observer } from 'mobx-react';
import React from 'react';
import NumberInputSetting from '../number-input-setting/NumberInputSetting';
import CheckboxSetting from '../checkbox-setting/CheckboxSetting';
import { useTranslation } from 'react-i18next';

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
  setAutoSnapshotInterval
}: Props) => {
  const { t } = useTranslation();
  
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={3}>
        <CheckboxSetting
          value={autoSnapshotting}
          handleChange={setAutoSnapshotting}
          translationKey="auto_snapshotting"
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <NumberInputSetting
          value={autoSnapshotInterval / 1000 / 60}
          handleChange={setAutoSnapshotInterval}
          translationKey="auto_snapshot_interval"
          disabled={!autoSnapshotting}
          minutes
        />
      </Grid>
    </Grid>
  );
};

export default observer(SnapshotSettings);

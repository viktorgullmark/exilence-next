import { inject, observer } from 'mobx-react';
import React from 'react';
import { SettingStore } from '../../../store/settingStore';
import SnapshotSettings from './SnapshotSettings';

interface Props {
  settingStore?: SettingStore;
}

const SnapshotSettingsContainer: React.FC<Props> = ({
  settingStore
}: Props) => {
  return (
    <SnapshotSettings
      autoSnapshotInterval={settingStore!.autoSnapshotInterval}
      autoSnapshotting={settingStore!.autoSnapshotting}
      setAutoSnapshotting={(value: boolean) => settingStore!.setAutoSnapshotting(value)}
      setAutoSnapshotInterval={(value: number) => settingStore!.setAutoSnapshotInterval(value)}
    />
  );
};

export default inject('settingStore')(observer(SnapshotSettingsContainer));

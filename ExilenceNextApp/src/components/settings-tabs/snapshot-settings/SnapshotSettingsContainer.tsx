import { inject, observer } from 'mobx-react';
import React from 'react';
import { SettingStore } from '../../../store/settingStore';
import SnapshotSettings from './SnapshotSettings';

type SnapshotSettingsContainerProps = {
  settingStore?: SettingStore;
}

const SnapshotSettingsContainer = ({ settingStore }: SnapshotSettingsContainerProps) => (
  <SnapshotSettings
    autoSnapshotInterval={settingStore!.autoSnapshotInterval}
    autoSnapshotting={settingStore!.autoSnapshotting}
    setAutoSnapshotting={(value: boolean) => settingStore!.setAutoSnapshotting(value)}
    setAutoSnapshotInterval={(value: number) => settingStore!.setAutoSnapshotInterval(value)}
  />
);
export default inject('settingStore')(observer(SnapshotSettingsContainer));

import React, { ChangeEvent } from 'react';
import { inject, observer } from 'mobx-react';

import { SettingStore } from '../../../store/settingStore';
import LogSettings from './LogSettings';

interface Props {
  settingStore?: SettingStore;
}
const LogSettingsContainer: React.FC<Props> = ({ settingStore }: Props) => {
  return (
    <LogSettings
      path={settingStore!.logPath}
      setLogPath={(value: string) => settingStore!.setLogPath(value)}
    />
  );
};

export default inject('settingStore')(observer(LogSettingsContainer));

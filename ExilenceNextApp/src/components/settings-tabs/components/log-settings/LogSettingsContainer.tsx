import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStores } from '../../../..';
import LogSettings from './LogSettings';

const LogSettingsContainer: React.FC = () => {
  const { settingStore } = useStores();
  return (
    <LogSettings
      path={settingStore!.logPath}
      setLogPath={(value: string) => settingStore!.setLogPath(value)}
    />
  );
};

export default observer(LogSettingsContainer);

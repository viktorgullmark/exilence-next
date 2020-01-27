import { inject, observer } from 'mobx-react';
import React, { ChangeEvent } from 'react';
import { SettingStore } from '../../../store/settingStore';
import UiSettings from './UiSettings';

interface Props {
  settingStore?: SettingStore;
}
const UiSettingsContainer: React.FC<Props> = ({
  settingStore
}: Props) => {
  return (
    <UiSettings
      uiScale={settingStore!.uiScale}
      setUiScale={(event: ChangeEvent<{}> | MouseEvent, value: number | string | number[]) => settingStore!.setUiScale(value)}
    />
  );
};

export default inject('settingStore')(observer(UiSettingsContainer));

import React, { ChangeEvent } from 'react';
import { inject, observer } from 'mobx-react';

import { SettingStore } from '../../../store/settingStore';
import UiSettings from './UiSettings';

type UiSettingsContainerProps = {
  settingStore?: SettingStore;
};
const UiSettingsContainer = ({ settingStore }: UiSettingsContainerProps) => (
  <UiSettings
    uiScale={settingStore!.uiScale}
    setUiScale={(_event: ChangeEvent<{}> | MouseEvent, value: number | string | number[]) =>
      settingStore!.setUiScale(value)
    }
  />
);

export default inject('settingStore')(observer(UiSettingsContainer));

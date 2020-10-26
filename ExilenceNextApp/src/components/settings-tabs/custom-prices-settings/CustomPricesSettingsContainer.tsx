import { inject, observer } from 'mobx-react';
import React from 'react';
import { UiStateStore } from '../../../store/uiStateStore';
import CustomPricesSettings from './CustomPricesSettings';

type CustomPricesSettingsContainerProps = {
  uiStateStore?: UiStateStore;
};
const CustomPricesSettingsContainer = ({ uiStateStore }: CustomPricesSettingsContainerProps) => {
  {
    uiStateStore!.initiated && uiStateStore!.validated ? (
      <CustomPricesSettings />
    ) : (
      <>Waiting for response from price source ..</>
    );
  }
};

export default inject('uiStateStore')(observer(CustomPricesSettingsContainer));

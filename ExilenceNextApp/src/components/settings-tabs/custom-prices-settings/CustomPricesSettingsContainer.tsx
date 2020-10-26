import { inject, observer } from 'mobx-react';
import React from 'react';
import { UiStateStore } from '../../../store/uiStateStore';
import CustomPricesSettings from './CustomPricesSettings';

type CustomPricesSettingsContainerProps = {
  uiStateStore?: UiStateStore;
};
const CustomPricesSettingsContainer = ({ uiStateStore }: CustomPricesSettingsContainerProps) => {
  return (
    <>
      {uiStateStore!.initiated && uiStateStore!.validated ? (
        <CustomPricesSettings />
      ) : (
        <>No prices has been fetched yet</>
      )}
    </>
  );
};

export default inject('uiStateStore')(observer(CustomPricesSettingsContainer));

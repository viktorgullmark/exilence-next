import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStores } from '../..';
import ToolbarStepper from './ToolbarStepper';

const ToolbarStepperContainer = () => {
  const { uiStateStore } = useStores();
  const handleClose = () => {
    uiStateStore!.setToolbarTourOpen(false);
    if (uiStateStore.shouldShowWhatsNewModal) {
      setTimeout(() => {
        uiStateStore.setShowWhatsNewModal(true);
      }, 1000);
    }
  };

  return <ToolbarStepper isOpen={uiStateStore!.toolbarTourOpen} handleClose={handleClose} />;
};

export default observer(ToolbarStepperContainer);

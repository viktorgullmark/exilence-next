import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStores } from '../..';
import ToolbarStepper from './ToolbarStepper';

const ToolbarStepperContainer = () => {
  const { uiStateStore } = useStores();
  const handleClose = () => {
    uiStateStore!.setToolbarTourOpen(false);
  };

  return <ToolbarStepper isOpen={uiStateStore!.toolbarTourOpen} handleClose={handleClose} />;
};

export default observer(ToolbarStepperContainer);

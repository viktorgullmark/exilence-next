import React from 'react';
import { inject, observer } from 'mobx-react';

import { UiStateStore } from '../../store/uiStateStore';
import ToolbarStepper from './ToolbarStepper';

type ToolbarStepperContainerProps = {
  uiStateStore?: UiStateStore;
};

const ToolbarStepperContainer = ({ uiStateStore }: ToolbarStepperContainerProps) => {
  const handleClose = () => {
    uiStateStore!.setToolbarTourOpen(false);
  };

  return <ToolbarStepper isOpen={uiStateStore!.toolbarTourOpen} handleClose={handleClose} />;
};

export default inject('uiStateStore')(observer(ToolbarStepperContainer));

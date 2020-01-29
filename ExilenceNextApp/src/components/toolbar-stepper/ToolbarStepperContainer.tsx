import React from 'react';
import { UiStateStore } from '../../store/uiStateStore';
import { observer, inject } from 'mobx-react';
import ToolbarStepper from './ToolbarStepper';

interface Props {
  uiStateStore?: UiStateStore;
}

const ToolbarStepperContainer: React.FC<Props> = ({ uiStateStore }) => {
  const handleClose = () => {
    uiStateStore!.setToolbarTourOpen(false);
  };

  return (
    <ToolbarStepper
      isOpen={uiStateStore!.toolbarTourOpen}
      handleClose={handleClose}
    />
  );
};

export default inject('uiStateStore')(observer(ToolbarStepperContainer));

import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useStores } from '../..';
import { getNetworthSessionToolbarSteps, getToolbarSteps } from '../../utils/stepper.utils';
import ToolbarStepper from './ToolbarStepper';

const ToolbarStepperContainer = () => {
  const { uiStateStore, accountStore } = useStores();
  const session = accountStore!.getSelectedAccount.activeProfile?.session;

  const handleClose = () => {
    uiStateStore!.setToolbarTourOpen(false);
    if (uiStateStore.shouldShowWhatsNewModal) {
      setTimeout(() => {
        uiStateStore.setShowWhatsNewModal(true);
      }, 1000);
    }
  };
  const handleNetWorthSessionClose = () => {
    uiStateStore!.setToolbarNetWorthSessionTourOpen(false);
  };

  useEffect(() => {
    if (uiStateStore!.toolbarTourOpen && uiStateStore.netWorthSessionOpen) {
      uiStateStore.toggleNetWorthSession();
    } else if (uiStateStore!.toolbarNetWorthSessionTourOpen) {
      if (session?.sessionStarted && !uiStateStore.netWorthSessionOpen) {
        uiStateStore.toggleNetWorthSession();
      } else {
        session?.startSession();
      }
    }
  }, [uiStateStore!.toolbarTourOpen, uiStateStore.toolbarNetWorthSessionTourOpen]);

  return uiStateStore.netWorthSessionOpen ? (
    <ToolbarStepper
      isOpen={uiStateStore!.toolbarNetWorthSessionTourOpen}
      stepDescriptors={getNetworthSessionToolbarSteps()}
      namespace={'net_worth_stepper'}
      handleClose={handleNetWorthSessionClose}
    />
  ) : (
    <ToolbarStepper
      isOpen={uiStateStore!.toolbarTourOpen}
      stepDescriptors={getToolbarSteps()}
      namespace={'stepper'}
      handleClose={handleClose}
    />
  );
};

export default observer(ToolbarStepperContainer);

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Tour from 'reactour';
import { Button, useTheme } from '@mui/material';

import { IStepDescriptor } from '../../interfaces/step-descriptor.interface';
import { getToolbarSteps } from '../../utils/stepper.utils';
import StepContent from './StepContent/StepContent';

type ToolbarStepperProps = {
  isOpen: boolean;
  handleClose: () => void;
};

const ToolbarStepper = ({ isOpen, handleClose }: ToolbarStepperProps) => {
  const [step, setStep] = useState(0);
  const { t } = useTranslation();
  const theme = useTheme();
  const stepDescriptors: IStepDescriptor[] = getToolbarSteps();
  const supportPanelStep = stepDescriptors.length - 1; // Support Panel should be always last
  const viewStep = [1, 2, 3].includes(step); // 1 - net worth, 2 - bulk sell, 3 - settings
  const isOnSupportPanelStep = step === supportPanelStep;
  const style = {
    color: '#000',
    maxWidth: 401,
    marginTop: isOnSupportPanelStep ? 10 : 0,
  };

  const steps = stepDescriptors.map((sd) => {
    return {
      selector: sd.selector,
      content: (
        <StepContent title={t(`stepper:title.${sd.key}`)} body={t(`stepper:body.${sd.key}`)} />
      ),
      style: style,
    };
  });

  return (
    <Tour
      steps={steps}
      isOpen={isOpen}
      showCloseButton={false}
      onRequestClose={handleClose}
      accentColor={theme.palette.primary.main}
      maskSpace={isOnSupportPanelStep || viewStep ? 0 : 16}
      closeWithMask={false}
      getCurrentStep={(currentStep) => setStep(currentStep)}
      startAt={0}
      lastStepNextButton={
        <Button color="primary" variant="contained">
          {t('action.lets_begin')}
        </Button>
      }
      disableInteraction
    />
  );
};

export default ToolbarStepper;

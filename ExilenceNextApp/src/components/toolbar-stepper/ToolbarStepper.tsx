import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Tour from 'reactour';
import { Button, useTheme } from '@mui/material';

import { IStepDescriptor } from '../../interfaces/step-descriptor.interface';
import { getToolbarSteps } from '../../utils/stepper.utils';
import StepContent from './StepContent/StepContent';
import i18next from 'i18next';

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
    maxWidth: 450,
    marginTop: isOnSupportPanelStep ? 20 : 0,
  };

  const steps = stepDescriptors.map((sd) => {
    const body2 = `stepper:body2.${sd.key}`;
    return {
      selector: sd.selector,
      content: (
        <StepContent
          title={t(`stepper:title.${sd.key}`)}
          body={t(`stepper:body.${sd.key}`)}
          body2={i18next.exists(body2) ? t(body2) : undefined}
        />
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

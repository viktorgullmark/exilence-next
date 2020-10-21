import React from 'react';
import { useTranslation } from 'react-i18next';
import Tour from 'reactour';
import { Button, useTheme } from '@material-ui/core';

import { IStepDescriptor } from '../../interfaces/step-descriptor.interface';
import { getToolbarSteps } from '../../utils/stepper.utils';
import StepContent from './StepContent/StepContent';

type ToolbarStepperProps = {
  isOpen: boolean;
  handleClose: () => void;
};

const ToolbarStepper = ({ isOpen, handleClose }: ToolbarStepperProps) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const style = {
    color: '#000',
  };

  const stepDescriptors: IStepDescriptor[] = getToolbarSteps();

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
    <>
      <Tour
        steps={steps}
        isOpen={isOpen}
        onRequestClose={handleClose}
        accentColor={theme.palette.primary.main}
        maskSpace={theme.spacing(2)}
        closeWithMask={false}
        lastStepNextButton={
          <Button color="primary" variant="contained">
            {t('action.lets_begin')}
          </Button>
        }
        disableInteraction
      />
    </>
  );
};

export default ToolbarStepper;

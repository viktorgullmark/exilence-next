import React from 'react';
import Tour from 'reactour';
import { useTheme, Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import StepContent from './StepContent/StepContent';
import { getToolbarSteps } from '../../utils/stepper.utils';
import { IStepDescriptor } from '../../interfaces/step-descriptor.interface';

type ToolbarStepperProps = {
  isOpen: boolean;
  handleClose: () => void;
}

const ToolbarStepper = ({ isOpen, handleClose }: ToolbarStepperProps) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const style = {
    color: '#000'
  };

  const stepDescriptors: IStepDescriptor[] = getToolbarSteps();

  const steps = stepDescriptors.map(sd => {
    return {
      selector: sd.selector,
      content: (
        <StepContent
          title={t(`stepper:title.${sd.key}`)}
          body={t(`stepper:body.${sd.key}`)}
        />
      ),
      style: style
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

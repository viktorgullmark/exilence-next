import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { Subject } from 'rxjs';

import useFormInput from '../../hooks/useFormInput';
import { withSubscription } from '../with-subscription/WithSubscription';
import LoginStepper from './LoginStepper';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from '../../store';
import { ApplicationSession } from './../../interfaces/application-session.interface';
import { useTranslation } from 'react-i18next';

const destroy$: Subject<boolean> = new Subject<boolean>();

const LoginStepperContainer: React.FC = () => {
  const { t } = useTranslation();

  const [activeStep, setActiveStep] = useState(1);
  const session = useSelector((state: AppState) => state.session);
  const dispatch = useDispatch()

  const accountName = useFormInput('');
  const sessionId = useFormInput('');

  const getSteps = () => {
    return [t('title.enter_acc_info'), t('title.select_leagues'), t('title.select_characters')];
  }
  
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return '';
      case 1:
        return '';
      case 2:
        return '';
      default:
        return '';
    }
  }

  const handleLogin = () => {
    dispatch({ type: 'INIT_SESSION', payload: { account: 'test' } as ApplicationSession });
  }

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
    handleLogin();
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <LoginStepper
      handleNext={() => handleNext()}
      handleBack={() => handleBack()}
      handleReset={() => handleReset()}
      getStepContent={(i: number) => getStepContent(i)}
      steps={getSteps()}
      activeStep={activeStep}
      accountName={accountName}
      sessionId={sessionId}>
    </LoginStepper>
  );
}

export default withSubscription(LoginStepperContainer, destroy$);

import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { Subject } from 'rxjs';

import useFormInput from '../../hooks/useFormInput';
import { withSubscription } from '../with-subscription/WithSubscription';
import LoginStepper from './LoginStepper';
import { ApplicationSession } from './../../interfaces/application-session.interface';
import { useTranslation } from 'react-i18next';
import { observer, inject } from 'mobx-react';
import { SessionStore } from './../../store/session/store';

interface LoginStepperProps {
  sessionStore?: SessionStore
}

const LoginStepperContainer: React.FC<LoginStepperProps> = ({ sessionStore }: LoginStepperProps) => {
  const { t } = useTranslation();

  const [activeStep, setActiveStep] = useState(1);

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
    sessionStore!.initSession({ account: 'test', sessionId: '123'});
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

export default inject('sessionStore')(observer(LoginStepperContainer));

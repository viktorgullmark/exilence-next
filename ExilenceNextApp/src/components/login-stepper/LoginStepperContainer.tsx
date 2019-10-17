import { inject, observer } from 'mobx-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useFormInput from '../../hooks/useFormInput';
import { AccountStore } from '../../store/account/store';
import LoginStepper from './LoginStepper';

interface LoginStepperProps {
  accountStore?: AccountStore
}

const LoginStepperContainer: React.FC<LoginStepperProps> = ({ accountStore }: LoginStepperProps) => {
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
    accountStore!.initSession({ account: 'test', sessionId: '123'});
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

export default inject('accountStore')(observer(LoginStepperContainer));

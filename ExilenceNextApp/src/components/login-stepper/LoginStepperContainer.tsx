import { inject, observer } from 'mobx-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import useFormInput from '../../hooks/useFormInput';
import { AccountStore } from '../../store/accountStore';
import { IAccount } from './../../interfaces/account.interface';
import { UiStateStore } from './../../store/uiStateStore';
import LoginStepper from './LoginStepper';

interface LoginStepperProps {
  accountStore?: AccountStore,
  uiStateStore?: UiStateStore
}

const LoginStepperContainer: React.FC<LoginStepperProps> = ({ accountStore, uiStateStore }: LoginStepperProps) => {
  const { t } = useTranslation();
  const { activeStep } = uiStateStore!.loginStepper;

  const accountName = useFormInput('');
  const sessionId = useFormInput('');

  const changeStep = (index: number) => {
    uiStateStore!.loginStepper.setActiveStep(index);
  };
  
  const getSteps = () => {
    return [t('title.enter_acc_info'), t('title.select_leagues'), t('title.select_characters')];
  }

  const handleLogin = (details: IAccount) => {
    accountStore!.initSession({ name: details.name, sessionId: details.sessionId});
  }

  const handleValidate = (details: IAccount) => {
    handleLogin(details);
  };

  const handleLeagueSubmit = () => {
    changeStep(activeStep + 1);
  }

  const handleBack = () => {
    changeStep(activeStep - 1);
  };

  const handleReset = () => {
    changeStep(0);
  };

  return (
    <LoginStepper
      handleValidate={(details: IAccount) => handleValidate(details)}
      handleLeagueSubmit={() => handleLeagueSubmit()}
      handleBack={() => handleBack()}
      handleReset={() => handleReset()}
      steps={getSteps()}
      activeStep={activeStep}
      accountName={accountName}
      sessionId={sessionId}>
    </LoginStepper>
  );
}

export default inject('accountStore', 'uiStateStore')(observer(LoginStepperContainer));

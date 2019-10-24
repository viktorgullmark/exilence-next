import { inject, observer } from 'mobx-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import useFormInput from '../../hooks/useFormInput';
import { AccountStore } from '../../store/accountStore';
import AccountValidationStep from './account-validation-step/AccountValidationStep';
import LoginStepper from './LoginStepper';
import LeagueSelectionStep from './league-selection-step/LeagueSelectionStep';
import CharacterSelectionStep from './character-selection-step/CharacterSelectionStep';
import { IAccount } from './../../interfaces/account.interface';

interface LoginStepperProps {
  accountStore?: AccountStore
}

const LoginStepperContainer: React.FC<LoginStepperProps> = ({ accountStore }: LoginStepperProps) => {
  const { t } = useTranslation();

  const [activeStep, setActiveStep] = useState(0);

  const accountName = useFormInput('');
  const sessionId = useFormInput('');

  const getSteps = () => {
    return [t('title.enter_acc_info'), t('title.select_leagues'), t('title.select_characters')];
  }

  const handleLogin = (details: IAccount) => {
    accountStore!.initSession({ name: details.name, sessionId: details.sessionId});
  }

  const handleValidate = (details: IAccount) => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
    handleLogin(details);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <LoginStepper
      handleValidate={(details: IAccount) => handleValidate(details)}
      handleBack={() => handleBack()}
      handleReset={() => handleReset()}
      steps={getSteps()}
      activeStep={activeStep}
      accountName={accountName}
      sessionId={sessionId}>
    </LoginStepper>
  );
}

export default inject('accountStore')(observer(LoginStepperContainer));

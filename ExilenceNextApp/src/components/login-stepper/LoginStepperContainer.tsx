import { inject, observer } from 'mobx-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AccountStore } from '../../store/accountStore';
import { IAccount } from './../../interfaces/account.interface';
import { UiStateStore } from './../../store/uiStateStore';
import LoginStepper from './LoginStepper';
import { ILeagueSelection } from './../../interfaces/league-selection.interface';
import { DropdownHelper } from './../../helpers/dropdown.helper';

interface LoginStepperProps {
  accountStore?: AccountStore;
  uiStateStore?: UiStateStore;
}

const LoginStepperContainer: React.FC<LoginStepperProps> = ({
  accountStore,
  uiStateStore
}: LoginStepperProps) => {
  const { t } = useTranslation();
  const { activeStep } = uiStateStore!.loginStepper;
  const {
    activeLeague,
    activePriceLeague,
    leagues
  } = accountStore!.getSelectedAccount;

  const selectedLeague = () => {
    return DropdownHelper.getDropdownSelection(leagues, activeLeague);
  };

  const selectedPriceLeague = () => {
    return DropdownHelper.getDropdownSelection(leagues, activePriceLeague);
  };

  const changeStep = (index: number) => {
    uiStateStore!.loginStepper.setActiveStep(index);
  };

  const getSteps = () => {
    return [
      t('title.enter_acc_info'),
      t('title.select_leagues'),
      t('title.select_characters')
    ];
  };

  const handleValidate = (details: IAccount) => {
    accountStore!.initSession({
      name: details.name,
      sessionId: details.sessionId
    });
  };

  const handleLeagueSubmit = (leagues: ILeagueSelection) => {
    accountStore!.getSelectedAccount.setActiveLeague(leagues.league);
    accountStore!.getSelectedAccount.setActivePriceLeague(leagues.priceLeague);
    changeStep(activeStep + 1);
  };

  const handleBack = () => {
    changeStep(activeStep - 1);
  };

  const handleReset = () => {
    changeStep(0);
  };

  return (
    <LoginStepper
      handleValidate={(details: IAccount) => handleValidate(details)}
      handleLeagueSubmit={(leagues: ILeagueSelection) =>
        handleLeagueSubmit(leagues)
      }
      handleBack={() => handleBack()}
      handleReset={() => handleReset()}
      selectedLeague={selectedLeague()}
      selectedPriceLeague={selectedPriceLeague()}
      steps={getSteps()}
      leagues={leagues}
      activeStep={activeStep}
    ></LoginStepper>
  );
};

export default inject('accountStore', 'uiStateStore')(
  observer(LoginStepperContainer)
);

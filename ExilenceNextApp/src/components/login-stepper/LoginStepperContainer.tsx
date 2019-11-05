import { inject, observer } from 'mobx-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

import { AccountStore } from '../../store/accountStore';
import { DropdownHelper } from './../../helpers/dropdown.helper';
import { IAccount } from './../../interfaces/account.interface';
import { UiStateStore } from './../../store/uiStateStore';
import LoginStepper from './LoginStepper';

interface LoginStepperProps {
  accountStore?: AccountStore;
  uiStateStore?: UiStateStore;
}

const LoginStepperContainer: React.FC<LoginStepperProps> = ({
  accountStore,
  uiStateStore
}: LoginStepperProps) => {
  const history = useHistory();
  const { t } = useTranslation();
  const { activeStep, isSubmitting } = uiStateStore!.loginStepper;
  const {
    activeLeagueUuid,
    activePriceLeagueUuid,
    leagues,
    priceLeagues
  } = accountStore!.getSelectedAccount;

  const account = accountStore!.getSelectedAccount;
  const {
    characters
  } = accountStore!.getSelectedAccount!.activeLeague;

  const selectedLeague = () => {
    return DropdownHelper.getDropdownSelection(leagues, activeLeagueUuid);
  };

  const selectedPriceLeague = () => {
    return DropdownHelper.getDropdownSelection(leagues, activePriceLeagueUuid);
  };

  const changeStep = (index: number) => {
    uiStateStore!.loginStepper.setActiveStep(index);
  };

  const getSteps = () => {
    return [
      t('title.enter_acc_info'),
      t('title.select_leagues')
    ];
  };

  const handleValidate = (details: IAccount) => {
    accountStore!.initSession({
      name: details.name,
      sessionId: details.sessionId
    });
  };

  const handleLeagueSubmit = () => {
    // reset sidenav when loginstepper finished
    uiStateStore!.toggleSidenav(false);
    history.push('/net-worth');
  };

  const handleLeagueChange = (selectedLeagueUuid: string) => {
    accountStore!.getSelectedAccount.setActiveLeague(selectedLeagueUuid);
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
      handleLeagueSubmit={() => handleLeagueSubmit()}
      handleLeagueChange={(uuid: string) => handleLeagueChange(uuid)}
      handleBack={() => handleBack()}
      handleReset={() => handleReset()}
      selectedLeague={selectedLeague()}
      selectedPriceLeague={selectedPriceLeague()}
      steps={getSteps()}
      leagues={leagues}
      priceLeagues={priceLeagues}
      characters={characters}
      activeStep={activeStep}
      isSubmitting={isSubmitting}
      account={account}
    ></LoginStepper>
  );
};

export default inject('accountStore', 'uiStateStore')(
  observer(LoginStepperContainer)
);

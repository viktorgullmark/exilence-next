import { inject, observer } from 'mobx-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AccountStore } from '../../store/accountStore';
import { IAccount } from './../../interfaces/account.interface';
import { UiStateStore } from './../../store/uiStateStore';
import LoginStepper from './LoginStepper';
import { ILeagueSelection } from './../../interfaces/league-selection.interface';
import { DropdownHelper } from './../../helpers/dropdown.helper';
import { Character } from './../../store/domains/character';

interface LoginStepperProps {
  accountStore?: AccountStore;
  uiStateStore?: UiStateStore;
}

const LoginStepperContainer: React.FC<LoginStepperProps> = ({
  accountStore,
  uiStateStore
}: LoginStepperProps) => {
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
    characters,
    activeCharacterUuid
  } = accountStore!.getSelectedAccount!.activeLeague;

  const selectedLeague = () => {
    return DropdownHelper.getDropdownSelection(leagues, activeLeagueUuid);
  };

  const selectedPriceLeague = () => {
    return DropdownHelper.getDropdownSelection(leagues, activePriceLeagueUuid);
  };

  const selectedCharacter = () => {
    return DropdownHelper.getDropdownSelection(characters, activeCharacterUuid);
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

  const handleLeagueSubmit = () => {
    changeStep(activeStep + 1);
  };

  const handleLeagueChange = (selectedLeagueUuid: string) => {
    accountStore!.getSelectedAccount.setActiveLeague(selectedLeagueUuid);
  };

  const handleCharacterSubmit = (character: Character) => {
    // todo: set active character
    // todo: complete and redirect to /authorized
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
      handleCharacterSubmit={(character: Character) =>
        handleCharacterSubmit(character)
      }
      handleBack={() => handleBack()}
      handleReset={() => handleReset()}
      selectedLeague={selectedLeague()}
      selectedPriceLeague={selectedPriceLeague()}
      selectedCharacter={selectedCharacter()}
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

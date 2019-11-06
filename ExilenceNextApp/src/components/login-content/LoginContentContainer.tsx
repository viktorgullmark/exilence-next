import { inject, observer } from 'mobx-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

import { AccountStore } from '../../store/accountStore';
import { DropdownHelper } from '../../helpers/dropdown.helper';
import { IAccount } from '../../interfaces/account.interface';
import { UiStateStore } from '../../store/uiStateStore';
import LoginContent from './LoginContent';
import { reaction } from 'mobx';

interface LoginContentProps {
  accountStore?: AccountStore;
  uiStateStore?: UiStateStore;
}

const LoginContentContainer: React.FC<LoginContentProps> = ({
  accountStore,
  uiStateStore
}: LoginContentProps) => {
  const history = useHistory();
  const { t } = useTranslation();
  const {
    activeLeagueUuid,
    activePriceLeagueUuid,
    leagues,
    priceLeagues,
    activeLeague
  } = accountStore!.getSelectedAccount;

  const selectedLeague = () => {
    return DropdownHelper.getDropdownSelection(leagues, activeLeagueUuid);
  };

  const selectedPriceLeague = () => {
    return DropdownHelper.getDropdownSelection(leagues, activePriceLeagueUuid);
  };

  const handleValidate = (details: IAccount) => {
    accountStore!.initSession({
      name: details.name,
      sessionId: details.sessionId
    });

    reaction(
      () => uiStateStore!.validated,
      (_cookie, reaction) => {
        history.push('/net-worth');
        reaction.dispose();
      }
    );
  };

  const handleLeagueSubmit = () => {
    // reset sidenav when loginstepper finished
    uiStateStore!.toggleSidenav(false);
    history.push('/net-worth');
  };

  const handleLeagueChange = (selectedLeagueUuid: string) => {
    accountStore!.getSelectedAccount.setActiveLeague(selectedLeagueUuid);
  };

  return (
    <LoginContent
      handleValidate={(details: IAccount) => handleValidate(details)}
      handleLeagueSubmit={() => handleLeagueSubmit()}
      handleLeagueChange={(uuid: string) => handleLeagueChange(uuid)}
      selectedLeague={selectedLeague()}
      selectedPriceLeague={selectedPriceLeague()}
      leagues={leagues}
      priceLeagues={priceLeagues}
      characters={activeLeague.characters}
      isSubmitting={uiStateStore!.isSubmitting}
      account={accountStore!.getSelectedAccount}
    ></LoginContent>
  );
};

export default inject('accountStore', 'uiStateStore')(
  observer(LoginContentContainer)
);

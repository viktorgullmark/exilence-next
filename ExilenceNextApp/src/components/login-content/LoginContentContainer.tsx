import React from 'react';
import { useLocation } from 'react-router';
import { inject, observer } from 'mobx-react';

import { IAccount } from '../../interfaces/account.interface';
import { AccountStore } from '../../store/accountStore';
import { UiStateStore } from '../../store/uiStateStore';
import { LeagueStore } from './../../store/leagueStore';
import LoginContent from './LoginContent';

type LoginContentProps = {
  accountStore?: AccountStore;
  uiStateStore?: UiStateStore;
  leagueStore?: LeagueStore;
};

const LoginContentContainer = ({ accountStore, uiStateStore }: LoginContentProps) => {
  const location = useLocation();

  const handleValidate = (details: IAccount) => {
    uiStateStore!.setLoginError(undefined);
    if (uiStateStore!.validated) {
      accountStore!.loadAuthWindow();
    } else {
      accountStore!.validateSession(location.pathname, details.sessionId);
    }
  };

  return (
    <LoginContent
      handleValidate={(details: IAccount) => handleValidate(details)}
      isSubmitting={uiStateStore!.isSubmitting}
      isInitiating={uiStateStore!.isInitiating}
      account={accountStore!.getSelectedAccount}
      errorMessage={uiStateStore!.loginError}
    />
  );
};

export default inject('accountStore', 'uiStateStore')(observer(LoginContentContainer));

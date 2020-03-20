import { reaction } from 'mobx';
import { inject, observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import { IAccount } from '../../interfaces/account.interface';
import { AccountStore } from '../../store/accountStore';
import { UiStateStore } from '../../store/uiStateStore';
import LoginContent from './LoginContent';
import { LeagueStore } from './../../store/leagueStore';

interface LoginContentProps {
  accountStore?: AccountStore;
  uiStateStore?: UiStateStore;
  leagueStore?: LeagueStore;
}

const LoginContentContainer: React.FC<LoginContentProps> = ({
  accountStore,
  uiStateStore
}: LoginContentProps) => {
  const history = useHistory();
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
    ></LoginContent>
  );
};

export default inject(
  'accountStore',
  'uiStateStore'
)(observer(LoginContentContainer));

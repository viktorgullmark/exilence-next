import { observer } from 'mobx-react-lite';
import React from 'react';
import { useLocation } from 'react-router';
import { useStores } from '../..';
import { IAccount } from '../../interfaces/account.interface';
import LoginContent from './LoginContent';

const LoginContentContainer = () => {
  const { uiStateStore, accountStore } = useStores();
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

export default observer(LoginContentContainer);

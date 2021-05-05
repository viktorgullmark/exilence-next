import { observer } from 'mobx-react-lite';
import React from 'react';
import { useLocation } from 'react-router';
import { useStores } from '../..';
import { AccountFormValues } from './account-validation-form/AccountValidationForm';
import LoginContent from './LoginContent';

const LoginContentContainer = () => {
  const { uiStateStore, accountStore } = useStores();
  const location = useLocation();
  const handleValidate = (form: AccountFormValues) => {
    uiStateStore!.setLoginError(undefined);
    if (uiStateStore!.validated) {
      accountStore!.loadOAuthPage();
    } else {
      if (form.platform) {
        uiStateStore.setSelectedPlatform(form.platform);
        accountStore!.validateSession(location.pathname);
      }
    }
  };

  return (
    <LoginContent
      handleValidate={(form: AccountFormValues) => handleValidate(form)}
      isSubmitting={uiStateStore!.isSubmitting}
      isInitiating={uiStateStore!.isInitiating}
      account={accountStore!.getSelectedAccount}
      errorMessage={uiStateStore!.loginError}
    />
  );
};

export default observer(LoginContentContainer);

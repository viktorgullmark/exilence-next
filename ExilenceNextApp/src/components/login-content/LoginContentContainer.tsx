import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useStores } from '../..';
import { AccountFormValues } from './account-validation-form/AccountValidationForm';
import LoginContent from './LoginContent';

const LoginContentContainer = () => {
  const { uiStateStore, accountStore } = useStores();

  useEffect(() => {
    // Set all active sessions offline on sign out
    accountStore!.accounts.forEach((acc) => {
      acc.activeProfile?.session.offlineSession();
    });
  }, []);

  const handleValidate = (form: AccountFormValues) => {
    uiStateStore!.setLoginError(undefined);
    if (form.platform) {
      uiStateStore.setSelectedPlatform(form.platform);
    }
    accountStore!.loadOAuthPage();
  };

  return (
    <LoginContent
      handleValidate={(form: AccountFormValues) => handleValidate(form)}
      isSubmitting={uiStateStore!.isSubmitting}
      isInitiating={uiStateStore!.isInitiating}
      account={accountStore!.getSelectedAccount}
      errorMessage={uiStateStore!.loginError}
      authUrl={accountStore!.authUrl}
    />
  );
};

export default observer(LoginContentContainer);

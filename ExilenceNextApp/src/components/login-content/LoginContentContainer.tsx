import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStores } from '../..';
import { AccountFormValues } from './account-validation-form/AccountValidationForm';
import LoginContent from './LoginContent';

const LoginContentContainer = () => {
  const { uiStateStore, accountStore } = useStores();

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

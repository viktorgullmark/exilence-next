import { reaction } from 'mobx';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { useHistory } from 'react-router';
import { IAccount } from '../../interfaces/account.interface';
import { AccountStore } from '../../store/accountStore';
import { UiStateStore } from '../../store/uiStateStore';
import LoginContent from './LoginContent';

interface LoginContentProps {
  accountStore?: AccountStore;
  uiStateStore?: UiStateStore;
}

const LoginContentContainer: React.FC<LoginContentProps> = ({
  accountStore,
  uiStateStore
}: LoginContentProps) => {
  const history = useHistory();

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

  return (
    <LoginContent
      handleValidate={(details: IAccount) => handleValidate(details)}
      isSubmitting={uiStateStore!.isSubmitting}
      account={accountStore!.getSelectedAccount}
    ></LoginContent>
  );
};

export default inject('accountStore', 'uiStateStore')(
  observer(LoginContentContainer)
);

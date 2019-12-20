import { reaction } from 'mobx';
import { inject, observer } from 'mobx-react';
import React from 'react';
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
  uiStateStore,
  leagueStore
}: LoginContentProps) => {
  const history = useHistory();
  const location = useLocation();

  uiStateStore!.setValidated(false);

  const handleValidate = (details: IAccount) => {
    accountStore!.initSession(location.pathname, {
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

export default inject('accountStore', 'uiStateStore', 'leagueStore')(
  observer(LoginContentContainer)
);

import React from 'react';
import { inject, observer } from 'mobx-react';

import { SignalrStore } from '../../store/signalrStore';
import { UiStateStore } from '../../store/uiStateStore';
import AccountMenu from './AccountMenu';
import { AccountStore } from '../../store/accountStore';

type AccountMenuContainerProps = {
  uiStateStore?: UiStateStore;
  accountStore?: AccountStore;
  signalrStore?: SignalrStore;
};

const AccountMenuContainer = ({
  uiStateStore,
  signalrStore,
  accountStore,
}: AccountMenuContainerProps) => {
  const open = Boolean(uiStateStore!.accountMenuAnchor);

  const handleMenuClose = () => {
    uiStateStore!.setAccountMenuAnchor(null);
  };

  const handleSignOut = () => {
    uiStateStore!.setAccountMenuAnchor(null);
    signalrStore!.signOut();
  };

  return (
    <AccountMenu
      open={open}
      disabled={!accountStore!.getSelectedAccount.activeProfile?.readyToSnapshot}
      anchorEl={uiStateStore!.accountMenuAnchor}
      handleMenuClose={handleMenuClose}
      handleSignOut={handleSignOut}
    />
  );
};

export default inject(
  'uiStateStore',
  'accountStore',
  'signalrStore'
)(observer(AccountMenuContainer));

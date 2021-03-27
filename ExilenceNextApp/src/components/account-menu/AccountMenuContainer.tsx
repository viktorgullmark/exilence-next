import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStores } from '../..';
import AccountMenu from './AccountMenu';

const AccountMenuContainer = () => {
  const { uiStateStore, accountStore, signalrStore } = useStores();
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

export default observer(AccountMenuContainer);

import { inject, observer } from 'mobx-react';
import React from 'react';
import { SignalrStore } from '../../store/signalrStore';
import { UiStateStore } from '../../store/uiStateStore';
import AccountMenu from './AccountMenu';

interface Props {
  uiStateStore?: UiStateStore;
  signalrStore?: SignalrStore;
}

const AccountMenuContainer: React.FC<Props> = ({ uiStateStore, signalrStore }: Props) => {
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
      anchorEl={uiStateStore!.accountMenuAnchor}
      handleMenuClose={handleMenuClose}
      handleSignOut={handleSignOut}
    />
  );
};

export default inject('uiStateStore', 'signalrStore')(observer(AccountMenuContainer));

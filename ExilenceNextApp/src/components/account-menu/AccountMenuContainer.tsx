import React from 'react';
import { useHistory } from 'react-router';
import { UiStateStore } from '../../store/uiStateStore';
import { inject, observer } from 'mobx-react';
import AccountMenu from './AccountMenu';

interface Props {
  uiStateStore?: UiStateStore;
}

const AccountMenuContainer: React.FC<Props> = ({ uiStateStore }: Props) => {
  const history = useHistory();
  const open = Boolean(uiStateStore!.accountMenuAnchor);

  const handleMenuClose = () => {
    uiStateStore!.setAccountMenuAnchor(null);
  };

  const handleSignOut = () => {
    history.push('/login');
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

export default inject('uiStateStore')(observer(AccountMenuContainer));

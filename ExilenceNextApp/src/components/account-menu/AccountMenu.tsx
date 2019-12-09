import React from 'react';
import { Menu, MenuItem } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

interface Props {
  open: boolean;
  anchorEl: HTMLElement | null;
  handleMenuClose: () => void;
  handleSignOut: () => void;
}

const AccountMenu: React.FC<Props> = ({
  anchorEl,
  open,
  handleMenuClose,
  handleSignOut
}: Props) => {
  const { t } = useTranslation();
  return (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id="account-menu"
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={open}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleSignOut}>{t('label.sign_out')}</MenuItem>
    </Menu>
  );
};

export default AccountMenu;

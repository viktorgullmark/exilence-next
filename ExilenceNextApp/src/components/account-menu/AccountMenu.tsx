import React from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, MenuItem } from '@mui/material';

type AccountMenuProps = {
  open: boolean;
  anchorEl: HTMLElement | null;
  disabled?: boolean;
  handleMenuClose: () => void;
  handleSignOut: () => void;
};

const AccountMenu = ({
  anchorEl,
  open,
  handleMenuClose,
  handleSignOut,
  disabled,
}: AccountMenuProps) => {
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
      <MenuItem disabled={disabled} onClick={handleSignOut}>
        {t('label.sign_out')}
      </MenuItem>
    </Menu>
  );
};

export default AccountMenu;

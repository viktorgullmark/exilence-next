import React from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, MenuItem } from '@mui/material';

type ItemTableMenuProps = {
  open: boolean;
  anchorEl: HTMLElement | null;
  exportDisabled?: boolean;
  handleMenuClose: () => void;
  handleExport: () => void;
};

const ItemTableMenu = ({
  anchorEl,
  open,
  exportDisabled,
  handleMenuClose,
  handleExport,
}: ItemTableMenuProps) => {
  const { t } = useTranslation();
  return (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id="item-table-menu"
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={open}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleExport} disabled={exportDisabled}>
        {t('label.net_worth_export')}
      </MenuItem>
    </Menu>
  );
};

export default ItemTableMenu;

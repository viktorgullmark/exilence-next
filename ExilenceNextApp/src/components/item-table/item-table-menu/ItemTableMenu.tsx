import React from 'react';
import { Menu, MenuItem } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

interface Props {
  open: boolean;
  anchorEl: HTMLElement | null;
  exportDisabled?: boolean;
  handleMenuClose: () => void;
  handleExport: () => void;
}

const ItemTableMenu: React.FC<Props> = ({
  anchorEl,
  open,
  exportDisabled,
  handleMenuClose,
  handleExport
}: Props) => {
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

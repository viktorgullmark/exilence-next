import React from 'react';
import { Menu, MenuItem } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

interface Props {
  open: boolean;
  anchorEl: HTMLElement | null;
  handleMenuClose: () => void;
  handleJoinGroup: () => void;
  handleCreateGroup: () => void;
}

const GroupMenu: React.FC<Props> = ({
  anchorEl,
  open,
  handleMenuClose,
  handleJoinGroup,
  handleCreateGroup
}: Props) => {
  const { t } = useTranslation();
  return (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id="group-menu"
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={open}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleJoinGroup}>{t('label.join_group')}</MenuItem>
      <MenuItem onClick={handleCreateGroup}>{t('label.create_group')}</MenuItem>
    </Menu>
  );
};

export default GroupMenu;

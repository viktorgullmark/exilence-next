import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStores } from '../../..';
import { exportData } from '../../../utils/export.utils';
import ItemTableMenu from './ItemTableMenu';

const ItemTableMenuContainer = () => {
  const { uiStateStore, signalrStore, accountStore } = useStores();
  const open = Boolean(uiStateStore!.itemTableMenuAnchor);
  const activeProfile = accountStore!.getSelectedAccount.activeProfile;
  const { activeGroup } = signalrStore!;

  const getItems = () => {
    if (activeProfile) {
      return activeGroup ? activeGroup.items : activeProfile.items;
    } else {
      return [];
    }
  };

  const handleMenuClose = () => {
    uiStateStore!.setItemTableMenuAnchor(null);
  };

  const handleExport = () => {
    handleMenuClose();
    exportData(getItems());
  };

  return (
    <ItemTableMenu
      open={open}
      anchorEl={uiStateStore!.itemTableMenuAnchor}
      handleMenuClose={handleMenuClose}
      handleExport={handleExport}
      exportDisabled={getItems().length === 0}
    />
  );
};

export default observer(ItemTableMenuContainer);

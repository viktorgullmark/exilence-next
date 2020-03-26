import { inject, observer } from 'mobx-react';
import React from 'react';
import { UiStateStore } from '../../../store/uiStateStore';
import ItemTableMenu from './ItemTableMenu';
import { SignalrStore } from '../../../store/signalrStore';
import { AccountStore } from '../../../store/accountStore';
import { exportData } from '../../../utils/export.utils';

interface Props {
  uiStateStore?: UiStateStore;
  signalrStore?: SignalrStore;
  accountStore?: AccountStore;
}

const ItemTableMenuContainer: React.FC<Props> = ({
  uiStateStore,
  signalrStore,
  accountStore
}: Props) => {
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
    exportData(getItems())
  };

  return (
    <ItemTableMenu
      open={open}
      anchorEl={uiStateStore!.itemTableMenuAnchor}
      handleMenuClose={handleMenuClose}
      handleExport={handleExport}
    />
  );
};

export default inject(
  'uiStateStore',
  'signalrStore',
  'accountStore'
)(observer(ItemTableMenuContainer));

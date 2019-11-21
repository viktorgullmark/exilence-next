import { inject, observer } from 'mobx-react';
import React, { useState } from 'react';
import { UiStateStore } from '../../store/uiStateStore';
import ItemTable from './ItemTable';
import { AccountStore } from '../../store/accountStore';

interface ItemTableContainerProps {
  uiStateStore?: UiStateStore;
  accountStore?: AccountStore;
}

const ItemTableContainer: React.FC<ItemTableContainerProps> = ({
  accountStore
}: ItemTableContainerProps) => {

  const tableItems = accountStore!.getSelectedAccount.activeProfile.tableItems;

  return <ItemTable items={tableItems} />;
};

export default inject('uiStateStore', 'accountStore')(observer(ItemTableContainer));

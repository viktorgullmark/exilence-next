import React, { useState } from 'react';
import Toolbar from './Toolbar';
import { observer, inject } from 'mobx-react';
import { UiStateStore } from './../../store/uiStateStore';
import { AccountStore } from '../../store/accountStore';

interface ToolbarContainerProps {
  uiStateStore?: UiStateStore;
  accountStore?: AccountStore;
}

const ToolbarContainer: React.FC<ToolbarContainerProps> = ({
  uiStateStore,
  accountStore
}: ToolbarContainerProps) => {

  const handleProfileChange = (
    event: React.ChangeEvent<{ value: string }>
  ) => {
    accountStore!.getSelectedAccount.setActiveProfile(event.target.value);
  };

  return (
    <Toolbar
      sidenavOpened={uiStateStore!.sidenavOpen}
      profiles={accountStore!.getSelectedAccount.profiles}
      activeProfile={accountStore!.getSelectedAccount.activeProfile}
      toggleSidenav={() => uiStateStore!.toggleSidenav()}
      handleProfileChange={handleProfileChange}
    />
  );
};

export default inject('uiStateStore', 'accountStore')(observer(ToolbarContainer));

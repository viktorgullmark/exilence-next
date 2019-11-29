import { inject, observer } from 'mobx-react';
import React, { useState, ChangeEvent } from 'react';
import { AccountStore } from '../../store/accountStore';
import { LeagueStore } from './../../store/leagueStore';
import { UiStateStore } from './../../store/uiStateStore';
import Toolbar from './Toolbar';
import { PriceStore } from '../../store/priceStore';

interface ToolbarContainerProps {
  uiStateStore?: UiStateStore;
  accountStore?: AccountStore;
  priceStore?: PriceStore;
  leagueStore?: LeagueStore;
}

const ToolbarContainer: React.FC<ToolbarContainerProps> = ({
  uiStateStore,
  accountStore,
  priceStore
}: ToolbarContainerProps) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleOpen = (edit: boolean = false) => {
    setIsEditing(edit);
    setProfileOpen(true);
  };

  const handleClose = () => {
    setProfileOpen(false);
  };

  const handleSnapshot = () => {
    accountStore!.getSelectedAccount.activeProfile.snapshot();
  };

  const handleProfileChange = (event: ChangeEvent<{ name?: string | undefined; value: unknown; }>) => {
    accountStore!.getSelectedAccount.setActiveProfile(event.target.value as string);
  };

  return (
    <Toolbar
      sidenavOpened={uiStateStore!.sidenavOpen}
      profiles={accountStore!.getSelectedAccount.profiles}
      activeProfile={accountStore!.getSelectedAccount.activeProfile}
      toggleSidenav={() => uiStateStore!.toggleSidenav()}
      handleProfileChange={handleProfileChange}
      handleSnapshot={handleSnapshot}
      isEditing={isEditing}
      profileOpen={profileOpen}
      handleProfileOpen={handleOpen}
      handleProfileClose={handleClose}
    />
  );
};

export default inject(
  'uiStateStore',
  'accountStore',
  'priceStore'
)(observer(ToolbarContainer));

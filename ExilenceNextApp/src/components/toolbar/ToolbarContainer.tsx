import { inject, observer } from 'mobx-react';
import React, { useState } from 'react';
import { AccountStore } from '../../store/accountStore';
import { LeagueStore } from './../../store/leagueStore';
import { UiStateStore } from './../../store/uiStateStore';
import Toolbar from './Toolbar';


interface ToolbarContainerProps {
  uiStateStore?: UiStateStore;
  accountStore?: AccountStore;
  leagueStore?: LeagueStore;
}

const ToolbarContainer: React.FC<ToolbarContainerProps> = ({
  uiStateStore,
  accountStore
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

  const handleProfileChange = (event: React.ChangeEvent<{ value: string }>) => {
    accountStore!.getSelectedAccount.setActiveProfile(event.target.value);
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
      handleProfileOpen={(edit: boolean) => handleOpen(edit)}
      handleProfileClose={() => handleClose()}
    />
  );
};

export default inject('uiStateStore', 'accountStore')(
  observer(ToolbarContainer)
);

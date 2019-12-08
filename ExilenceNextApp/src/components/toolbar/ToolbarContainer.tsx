import { inject, observer } from 'mobx-react';
import React, { useState, ChangeEvent } from 'react';
import { AccountStore } from '../../store/accountStore';
import { LeagueStore } from './../../store/leagueStore';
import { UiStateStore } from './../../store/uiStateStore';
import Toolbar from './Toolbar';
import { PriceStore } from '../../store/priceStore';
import { NotificationStore } from '../../store/notificationStore';

interface ToolbarContainerProps {
  uiStateStore?: UiStateStore;
  accountStore?: AccountStore;
  leagueStore?: LeagueStore;
  notificationStore?: NotificationStore;
}

const ToolbarContainer: React.FC<ToolbarContainerProps> = ({
  uiStateStore,
  accountStore,
  notificationStore
}: ToolbarContainerProps) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { notifications, markAllAsRead  } = notificationStore!;  

  const handleOpen = (edit: boolean = false) => {
    setIsEditing(edit);
    setProfileOpen(true);
  };

  const handleClose = () => {
    setProfileOpen(false);
  };

  const handleClearSnapshots = () => {
    accountStore!.getSelectedAccount.activeProfile.clearSnapshots();
  };

  const handleSnapshot = () => {
    accountStore!.getSelectedAccount.activeProfile.snapshot();
  };

  const handleProfileChange = (event: ChangeEvent<{ name?: string | undefined; value: unknown; }>) => {
    accountStore!.getSelectedAccount.setActiveProfile(event.target.value as string);
  };

  const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) => {
    uiStateStore!.setNotificationList([...notifications]);
    notificationStore!.markAllAsRead();
    uiStateStore!.setNotificationListAnchor(event.currentTarget);
  };

  return (
    <Toolbar
      sidenavOpened={uiStateStore!.sidenavOpen}
      profiles={accountStore!.getSelectedAccount.profiles}
      activeProfile={accountStore!.getSelectedAccount.activeProfile}
      toggleSidenav={() => uiStateStore!.toggleSidenav()}
      markAllNotificationsRead={() => notificationStore!.markAllAsRead()}
      handleProfileChange={handleProfileChange}
      handleSnapshot={handleSnapshot}
      isEditing={isEditing}
      profileOpen={profileOpen}
      handleProfileOpen={handleOpen}
      handleProfileClose={handleClose}
      notifications={notificationStore!.notifications}
      unreadNotifications={notificationStore!.unreadNotifications}
      handleNotificationsOpen={handleNotificationsOpen}
      handleClearSnapshots={handleClearSnapshots}
      isSnapshotting={accountStore!.getSelectedAccount.activeProfile.isSnapshotting}
    />
  );
};

export default inject(
  'uiStateStore',
  'accountStore',
  'notificationStore'
)(observer(ToolbarContainer));

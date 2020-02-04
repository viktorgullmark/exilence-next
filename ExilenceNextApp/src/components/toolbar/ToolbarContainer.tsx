import { inject, observer } from 'mobx-react';
import React, { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AccountStore } from '../../store/accountStore';
import { NotificationStore } from '../../store/notificationStore';
import ConfirmationDialog from '../confirmation-dialog/ConfirmationDialog';
import { LeagueStore } from './../../store/leagueStore';
import { UiStateStore } from './../../store/uiStateStore';
import Toolbar from './Toolbar';
import { SignalrStore } from '../../store/signalrStore';
import { PriceStore } from '../../store/priceStore';
import { SettingStore } from '../../store/settingStore';

interface ToolbarContainerProps {
  uiStateStore?: UiStateStore;
  accountStore?: AccountStore;
  leagueStore?: LeagueStore;
  notificationStore?: NotificationStore;
  signalrStore?: SignalrStore;
  priceStore?: PriceStore;
  settingStore?: SettingStore;
}

const ToolbarContainer: React.FC<ToolbarContainerProps> = ({
  uiStateStore,
  accountStore,
  signalrStore,
  notificationStore,
  priceStore,
  settingStore
}: ToolbarContainerProps) => {
  const { t } = useTranslation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { notifications } = notificationStore!;

  const handleOpen = (edit: boolean = false) => {
    setIsEditing(edit);
    setProfileOpen(true);
  };

  const handleClose = () => {
    setProfileOpen(false);
  };

  const handleClearSnapshots = () => {
    accountStore!.getSelectedAccount.activeProfile!.removeAllSnapshots();
  };

  const handleRemoveProfile = () => {
    accountStore!.getSelectedAccount.removeActiveProfile();
  };

  const handleSnapshot = () => {
    accountStore!.getSelectedAccount.activeProfile!.snapshot();
  };

  const handleProfileChange = (
    event: ChangeEvent<{ name?: string | undefined; value: unknown }>
  ) => {
    accountStore!.getSelectedAccount.setActiveProfile(
      event.target.value as string
    );
  };

  const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) => {
    uiStateStore!.setNotificationList([...notifications]);
    notificationStore!.markAllAsRead();
    uiStateStore!.setNotificationListAnchor(event.currentTarget);
  };

  const handleAccountMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    uiStateStore!.setAccountMenuAnchor(event.currentTarget);
  };

  return (
    <>
      <ConfirmationDialog
        show={uiStateStore!.confirmClearSnapshotsDialogOpen}
        onClose={() => uiStateStore!.setConfirmClearSnapshotsDialogOpen(false)}
        onConfirm={handleClearSnapshots}
        title={t('title.confirm_clear_snapshots')}
        body={t('body.clear_snapshots')}
        acceptButtonText={t('action.confirm')}
        cancelButtonText={t('action.cancel')}
        loading={uiStateStore!.clearingSnapshots}
      />
      <ConfirmationDialog
        show={uiStateStore!.confirmRemoveProfileDialogOpen}
        onClose={() => uiStateStore!.setConfirmRemoveProfileDialogOpen(false)}
        onConfirm={handleRemoveProfile}
        title={t('title.confirm_remove_profile')}
        body={t('body.remove_profile')}
        acceptButtonText={t('action.confirm')}
        cancelButtonText={t('action.cancel')}
        loading={uiStateStore!.removingProfile}
      />
      <Toolbar
        changingProfile={uiStateStore!.changingProfile}
        signalrOnline={signalrStore!.online}
        sidenavOpened={uiStateStore!.sidenavOpen}
        autoSnapshotting={settingStore!.autoSnapshotting}
        groupOverviewOpened={uiStateStore!.groupOverviewOpen}
        profiles={accountStore!.getSelectedAccount.profiles}
        activeProfile={accountStore!.getSelectedAccount.activeProfile}
        toggleSidenav={() => uiStateStore!.toggleSidenav()}
        toggleGroupOverview={() => uiStateStore!.toggleGroupOverview()}
        handleProfileChange={handleProfileChange}
        handleSnapshot={handleSnapshot}
        isEditing={isEditing}
        profileOpen={profileOpen}
        handleProfileOpen={handleOpen}
        handleProfileClose={handleClose}
        unreadNotifications={notificationStore!.unreadNotifications}
        handleNotificationsOpen={handleNotificationsOpen}
        handleAccountMenuOpen={handleAccountMenuOpen}
        handleClearSnapshots={() =>
          uiStateStore!.setConfirmClearSnapshotsDialogOpen(true)
        }
        handleRemoveProfile={() =>
          uiStateStore!.setConfirmRemoveProfileDialogOpen(true)
        }
        isSnapshotting={uiStateStore!.isSnapshotting}
        isInitiating={uiStateStore!.isInitiating}
        isUpdatingPrices={priceStore!.isUpdatingPrices}
        profilesLoaded={uiStateStore!.profilesLoaded}
      />
    </>
  );
};

export default inject(
  'uiStateStore',
  'accountStore',
  'notificationStore',
  'signalrStore',
  'priceStore',
  'settingStore'
)(observer(ToolbarContainer));

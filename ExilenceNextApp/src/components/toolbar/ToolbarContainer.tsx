import React, { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { inject, observer } from 'mobx-react';

import { AccountStore } from '../../store/accountStore';
import { NotificationStore } from '../../store/notificationStore';
import { OverlayStore } from '../../store/overlayStore';
import { PriceStore } from '../../store/priceStore';
import { SettingStore } from '../../store/settingStore';
import { SignalrStore } from '../../store/signalrStore';
import { formatValue } from '../../utils/snapshot.utils';
import ConfirmationDialog from '../confirmation-dialog/ConfirmationDialog';
import { LeagueStore } from './../../store/leagueStore';
import { UiStateStore } from './../../store/uiStateStore';
import Toolbar from './Toolbar';
import { LogStore } from '../../store/logStore';
import { Observable, from, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

type ToolbarContainerProps = {
  uiStateStore?: UiStateStore;
  accountStore?: AccountStore;
  leagueStore?: LeagueStore;
  notificationStore?: NotificationStore;
  signalrStore?: SignalrStore;
  priceStore?: PriceStore;
  settingStore?: SettingStore;
  overlayStore?: OverlayStore;
  logStore?: LogStore;
};

const ToolbarContainer = ({
  uiStateStore,
  accountStore,
  signalrStore,
  notificationStore,
  priceStore,
  settingStore,
  overlayStore,
  logStore,
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

  const activeCurrency = () => {
    return accountStore!.getSelectedAccount!.activeProfile!
      ? accountStore!.getSelectedAccount!.activeProfile!.activeCurrency
      : { name: 'chaos', short: 'c' };
  };

  const handleOverlay = () => {
    //todo: rework to toggle modal instead, with buttons for each overlay

    const income = formatValue(
      signalrStore!.activeGroup
        ? signalrStore!.activeGroup.income
        : accountStore!.getSelectedAccount!.activeProfile!.income,
      activeCurrency().short,
      true
    );

    const netWorth = signalrStore!.activeGroup
      ? signalrStore!.activeGroup.netWorthValue
      : accountStore!.getSelectedAccount!.activeProfile!.netWorthValue;

    overlayStore!.createOverlay({
      event: 'netWorth',
      data: { netWorth: netWorth, income: income },
    });
  };

  const handleLogMonitor = () => {
    logStore!.running
      ? logStore!.stopLogMonitor()
      : of(true)
          .pipe(
            delay(250),
            tap(() => {
              logStore!.createLogMonitor();
            }),
            delay(500),
            tap(() => {
              logStore!.setLogMonitorPath(settingStore!.logPath);
            }),
            delay(750),
            tap(() => {
              logStore!.startLogMonitor();
            })
          )
          .subscribe();
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
    accountStore!.getSelectedAccount.setActiveProfile(event.target.value as string);
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
        handleOverlay={handleOverlay}
        handleLogMonitor={handleLogMonitor}
        unreadNotifications={notificationStore!.unreadNotifications}
        handleNotificationsOpen={handleNotificationsOpen}
        handleAccountMenuOpen={handleAccountMenuOpen}
        handleClearSnapshots={() => uiStateStore!.setConfirmClearSnapshotsDialogOpen(true)}
        handleRemoveProfile={() => uiStateStore!.setConfirmRemoveProfileDialogOpen(true)}
        isSnapshotting={uiStateStore!.isSnapshotting}
        isInitiating={uiStateStore!.isInitiating || uiStateStore!.isValidating}
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
  'settingStore',
  'overlayStore',
  'logStore'
)(observer(ToolbarContainer));

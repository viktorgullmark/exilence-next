import { SelectChangeEvent } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { useStores } from '../..';
import { formatValue } from '../../utils/snapshot.utils';
import ConfirmationDialog from '../confirmation-dialog/ConfirmationDialog';
import RemoveSnapshotsDialogContainer from '../remove-snapshots-dialog/RemoveSnapshotsDialogContainer';
import Toolbar from './Toolbar';

const ToolbarContainer = () => {
  const {
    uiStateStore,
    accountStore,
    signalrStore,
    notificationStore,
    priceStore,
    settingStore,
    overlayStore,
    logStore,
    rateLimitStore,
  } = useStores();
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

  const handleOverlay = () => {
    //todo: rework to toggle modal instead, with buttons for each overlay
    let income: number;
    let netWorth: number;
    if (uiStateStore.netWorthSessionOpen) {
      income = accountStore.getSelectedAccount!.activeProfile!.session.income;
      netWorth = netWorth = accountStore.getSelectedAccount.activeProfile!.session.netWorthValue;
    } else {
      income = signalrStore!.activeGroup
        ? signalrStore!.activeGroup.income
        : accountStore!.getSelectedAccount!.activeProfile!.income;
      netWorth = signalrStore!.activeGroup
        ? signalrStore!.activeGroup.netWorthValue
        : accountStore!.getSelectedAccount!.activeProfile!.netWorthValue;
    }

    if (settingStore.currency === 'exalt' && priceStore.exaltedPrice) {
      income = income / priceStore.exaltedPrice;
    }

    if (settingStore.currency === 'divine' && priceStore.divinePrice) {
      income = income / priceStore.divinePrice;
    }

    const formattedIncome = formatValue(
      income,
      settingStore.activeCurrency.short,
      true,
      !priceStore.exaltedPrice
    );

    overlayStore!.createOverlay({
      event: 'netWorth',
      data: {
        netWorth: netWorth,
        income: formattedIncome,
        short: settingStore.activeCurrency.short,
      },
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

  const handleStartSession = () => {
    accountStore!.getSelectedAccount.activeProfile?.session.startSession();
  };

  const handlePauseSession = () => {
    accountStore!.getSelectedAccount.activeProfile?.session.pauseSession();
  };

  const handleStopSession = () => {
    accountStore!.getSelectedAccount.activeProfile?.session.stopSession();
    uiStateStore!.setConfirmStopSessionDialogOpen(false);
  };

  const handleSnapshot = () => {
    accountStore!.getSelectedAccount.activeProfile!.snapshot();
  };

  const handleProfileChange = (event: SelectChangeEvent<string>) => {
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
      <RemoveSnapshotsDialogContainer />
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
      <ConfirmationDialog
        show={uiStateStore!.confirmStopSessionDialogOpen}
        onClose={() => uiStateStore!.setConfirmStopSessionDialogOpen(false)}
        onConfirm={handleStopSession}
        title={t('title.confirm_stop_net_worth_session')}
        body={t('body.stop_net_worth_session')}
        acceptButtonText={t('action.confirm')}
        cancelButtonText={t('action.cancel')}
      />
      <Toolbar
        hasPrices={
          priceStore!.activePricesWithCustomValues &&
          priceStore!.activePricesWithCustomValues.length > 0
        }
        changingProfile={uiStateStore!.changingProfile}
        signalrOnline={signalrStore!.online}
        sidenavOpened={uiStateStore!.sidenavOpen}
        autoSnapshotting={settingStore!.autoSnapshotting}
        groupOverviewOpened={uiStateStore!.groupOverviewOpen}
        sessionStarted={Boolean(
          accountStore!.getSelectedAccount.activeProfile?.session.sessionStarted
        )}
        sessionPaused={Boolean(
          accountStore!.getSelectedAccount.activeProfile?.session.sessionPaused
        )}
        sessionNetWorthOpened={uiStateStore.netWorthSessionOpen}
        profiles={accountStore!.getSelectedAccount.profiles}
        activeProfile={accountStore!.getSelectedAccount.activeProfile}
        toggleAutosnapshot={() =>
          settingStore!.setAutoSnapshotting(!settingStore!.autoSnapshotting)
        }
        toggleSidenav={() => uiStateStore!.toggleSidenav()}
        toggleGroupOverview={() => uiStateStore!.toggleGroupOverview()}
        handleProfileChange={handleProfileChange}
        handleSnapshot={handleSnapshot}
        isEditing={isEditing}
        statusMessage={uiStateStore!.statusMessage}
        retryAfter={rateLimitStore.retryAfter}
        profileOpen={profileOpen}
        toggleSessionNetWorth={() => uiStateStore!.toggleNetWorthSession()}
        handleSessionStart={handleStartSession}
        handleSessionPause={handlePauseSession}
        handleSessionStop={() => uiStateStore!.setConfirmStopSessionDialogOpen(true)}
        handleProfileOpen={handleOpen}
        handleProfileClose={handleClose}
        handleOverlay={handleOverlay}
        handleLogMonitor={handleLogMonitor}
        unreadNotifications={notificationStore!.unreadNotifications}
        handleNotificationsOpen={handleNotificationsOpen}
        handleAccountMenuOpen={handleAccountMenuOpen}
        handleClearSnapshots={() => uiStateStore!.setRemoveSnapshotsDialogOpen(true)}
        handleRemoveProfile={() => uiStateStore!.setConfirmRemoveProfileDialogOpen(true)}
        handleCancelSnapshot={() => uiStateStore!.setCancelSnapshot(true)}
        isSnapshotting={uiStateStore!.isSnapshotting}
        isInitiating={uiStateStore!.isInitiating || uiStateStore!.isValidating}
        isUpdatingPrices={priceStore!.isUpdatingPrices}
        profilesLoaded={uiStateStore!.profilesLoaded}
      />
    </>
  );
};

export default observer(ToolbarContainer);

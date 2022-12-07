import WarningIcon from '@mui/icons-material/Warning';
import { AppBar, Box, Grid, SelectChangeEvent, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import MuiToolbar from '@mui/material/Toolbar';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { IStatusMessage } from '../../interfaces/status-message.interface';
import { Notification } from '../../store/domains/notification';
import AccountMenuContainer from '../account-menu/AccountMenuContainer';
import CountdownTimer from '../countdown-timer/CountdownTimer';
import CreateGroupDialogContainer from '../group-dialog/GroupDialogContainer';
import NotificationListContainer from '../notification-list/NotificationListContainer';
import ProfileDialogContainer from '../profile-dialog/ProfileDialogContainer';
import StatusMessageContainer from '../status-message/StatusMessageContainer';
import ToolbarStepperContainer from '../toolbar-stepper/ToolbarStepperContainer';
import { Profile } from './../../store/domains/profile';
import useStyles from './Toolbar.styles';
import NetWorthSessionGridItem from './toolbarGridItems/netWorthSessionGridItem/NetWorthSessionGridItem';
import ProfileGridItem from './toolbarGridItems/profileGridItem/ProfileGridItem';
import SnapshotAreaGridItem from './toolbarGridItems/snapshotAreaGridItem/SnapshotAreaGridItem';
import OverlayAreaGridItem from './toolbarGridItems/overlayAreaGridItem/OverlayAreaGridItem';
import GroupAreaGridItem from './toolbarGridItems/groupAreaGridItem/GroupAreaGridItem';
import MiscAreaGridItem from './toolbarGridItems/miscAreaGridItem/MiscAreaGridItem';

type ToolbarProps = {
  signalrOnline: boolean;
  sidenavOpened: boolean;
  autoSnapshotting: boolean;
  groupOverviewOpened: boolean;
  sessionStarted: boolean;
  sessionPaused: boolean;
  sessionNetWorthOpened: boolean;
  activeProfile?: Profile;
  profiles: Profile[];
  profileOpen: boolean;
  isEditing: boolean;
  isInitiating: boolean;
  unreadNotifications: Notification[];
  isSnapshotting: boolean;
  isUpdatingPrices: boolean;
  profilesLoaded: boolean;
  changingProfile: boolean;
  hasPrices?: boolean;
  retryAfter: number;
  statusMessage?: IStatusMessage;
  toggleAutosnapshot: () => void;
  toggleSidenav: () => void;
  toggleGroupOverview: () => void;
  toggleSessionNetWorth: () => void;
  handleSessionStart: () => void;
  handleSessionPause: () => void;
  handleSessionStop: () => void;
  handleProfileOpen: (edit?: boolean) => void;
  handleProfileClose: () => void;
  handleProfileChange: (event: SelectChangeEvent<string>) => void;
  handleSnapshot: () => void;
  handleOverlay: () => void;
  handleLogMonitor: () => void;
  handleNotificationsOpen: (event: React.MouseEvent<HTMLElement>) => void;
  handleAccountMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
  handleClearSnapshots: () => void;
  handleRemoveProfile: () => void;
  handleCancelSnapshot: () => void;
};

const Toolbar = ({
  signalrOnline,
  sidenavOpened,
  groupOverviewOpened,
  sessionStarted,
  sessionPaused,
  activeProfile,
  hasPrices,
  profiles,
  profileOpen,
  isEditing,
  isInitiating,
  unreadNotifications,
  isSnapshotting,
  isUpdatingPrices,
  profilesLoaded,
  changingProfile,
  statusMessage,
  retryAfter,
  toggleGroupOverview,
  toggleSessionNetWorth,
  handleSessionStart,
  handleSessionPause,
  handleSessionStop,
  handleProfileOpen,
  handleProfileClose,
  handleProfileChange,
  handleSnapshot,
  handleNotificationsOpen,
  handleAccountMenuOpen,
  handleClearSnapshots,
  handleRemoveProfile,
  handleOverlay,
  handleCancelSnapshot,
}: ToolbarProps) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const fetchingPricesMsg: IStatusMessage = {
    message: 'fetching_prices',
  };

  return (
    <>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: sidenavOpened || groupOverviewOpened,
          [classes.fromLeft]: sidenavOpened,
          [classes.fromRight]: groupOverviewOpened,
        })}
      >
        <ToolbarStepperContainer />
        <MuiToolbar className={clsx(classes.toolbar, { [classes.baseMargin]: !sidenavOpened })}>
          {!signalrOnline && retryAfter === 0 && (
            <>
              <WarningIcon
                titleAccess={t('label.server_offline_title')}
                className={classes.offlineIcon}
              />
              {!statusMessage && (
                <Box display="flex" alignItems="center" width={420}>
                  <Typography variant="caption">{t('label.server_offline_title')}</Typography>
                </Box>
              )}
            </>
          )}
          {signalrOnline && !hasPrices && retryAfter === 0 && (
            <>
              <WarningIcon
                titleAccess={t('label.no_prices_retrieved', {
                  league: activeProfile?.activePriceLeagueId,
                })}
                className={classes.offlineIcon}
              />
              {!statusMessage && (
                <Box display="flex" alignItems="center" width={420}>
                  <Typography variant="caption">{t('label.no_prices')}</Typography>
                </Box>
              )}
            </>
          )}
          {retryAfter > 0 && (
            <>
              <WarningIcon
                titleAccess={t('label.rate_limit_exceeded')}
                className={classes.offlineIcon}
              />
              <Box display="flex" alignItems="center" width={420}>
                <Typography variant="caption">
                  {t('label.rate_limit_exceeded_prefix')}:&nbsp;
                </Typography>
                <CountdownTimer comparison={retryAfter} />
              </Box>
            </>
          )}
          {(isInitiating || changingProfile || isUpdatingPrices || isSnapshotting) &&
            retryAfter === 0 && (
              <Box ml={1} display="flex" alignItems="center" justifyContent="center">
                <CircularProgress
                  className={classes.leftSpinner}
                  title={t('label.loading_title')}
                  size={20}
                />
              </Box>
            )}
          {retryAfter === 0 && (
            <Box ml={2} display="flex" whiteSpace="nowrap">
              {statusMessage && <StatusMessageContainer />}
              {!statusMessage && isUpdatingPrices && (
                <StatusMessageContainer overrideMessage={fetchingPricesMsg} />
              )}
            </Box>
          )}
          <Grid
            container
            alignItems="center"
            justifyContent="flex-end"
            className={classes.toolbarGrid}
          >
            <NetWorthSessionGridItem
              sessionStarted={sessionStarted}
              sessionPaused={sessionPaused}
              signalrOnline={signalrOnline}
              isSnapshotting={isSnapshotting}
              activeProfile={activeProfile}
              isInitiating={isInitiating}
              profilesLoaded={profilesLoaded}
              toggleSessionNetWorth={toggleSessionNetWorth}
              handleSessionStart={handleSessionStart}
              handleSessionPause={handleSessionPause}
              handleSessionStop={handleSessionStop}
            />
            <Grid item className={classes.divider} />
            <ProfileGridItem
              profiles={profiles}
              signalrOnline={signalrOnline}
              isSnapshotting={isSnapshotting}
              activeProfile={activeProfile}
              isInitiating={isInitiating}
              profilesLoaded={profilesLoaded}
              handleRemoveProfile={handleRemoveProfile}
              handleProfileOpen={handleProfileOpen}
              handleProfileChange={handleProfileChange}
            />
            <Grid item className={classes.divider} />
            <SnapshotAreaGridItem
              signalrOnline={signalrOnline}
              isSnapshotting={isSnapshotting}
              activeProfile={activeProfile}
              retryAfter={retryAfter}
              handleSnapshot={handleSnapshot}
              handleClearSnapshots={handleClearSnapshots}
              handleCancelSnapshot={handleCancelSnapshot}
            />
            <Grid item className={classes.divider} />
            <OverlayAreaGridItem handleOverlay={handleOverlay} />
            <Grid item className={classes.divider} />
            <GroupAreaGridItem
              signalrOnline={signalrOnline}
              isSnapshotting={isSnapshotting}
              toggleGroupOverview={toggleGroupOverview}
            />
            <Grid item className={classes.divider} />
            <MiscAreaGridItem
              isInitiating={isInitiating}
              isSnapshotting={isSnapshotting}
              unreadNotifications={unreadNotifications}
              handleNotificationsOpen={handleNotificationsOpen}
              handleAccountMenuOpen={handleAccountMenuOpen}
            />
          </Grid>
        </MuiToolbar>
      </AppBar>
      <AccountMenuContainer />
      <NotificationListContainer />
      <ProfileDialogContainer
        profile={activeProfile}
        isOpen={profileOpen}
        isEditing={isEditing}
        handleClickClose={handleProfileClose}
        handleClickOpen={handleProfileOpen}
      />
      <CreateGroupDialogContainer />
    </>
  );
};

export default observer(Toolbar);

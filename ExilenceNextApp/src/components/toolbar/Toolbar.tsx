import { Cancel } from '@mui/icons-material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import AddIcon from '@mui/icons-material/Add';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import GroupIcon from '@mui/icons-material/Group';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import UpdateIcon from '@mui/icons-material/Update';
import WarningIcon from '@mui/icons-material/Warning';
import {
  AppBar,
  Badge,
  Box,
  Button,
  FormControl,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tooltip,
  Typography,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import MuiToolbar from '@mui/material/Toolbar';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { IStatusMessage } from '../../interfaces/status-message.interface';
import { Notification } from '../../store/domains/notification';
import { getDropdownSelection, mapDomainToDropdown } from '../../utils/dropdown.utils';
import AccountMenuContainer from '../account-menu/AccountMenuContainer';
import CountdownTimer from '../countdown-timer/CountdownTimer';
import CreateGroupDialogContainer from '../group-dialog/GroupDialogContainer';
import NotificationListContainer from '../notification-list/NotificationListContainer';
import ProfileDialogContainer from '../profile-dialog/ProfileDialogContainer';
import StatusMessageContainer from '../status-message/StatusMessageContainer';
import ToolbarStepperContainer from '../toolbar-stepper/ToolbarStepperContainer';
import { Profile } from './../../store/domains/profile';
import useStyles from './Toolbar.styles';

type ToolbarProps = {
  signalrOnline: boolean;
  sidenavOpened: boolean;
  autoSnapshotting: boolean;
  groupOverviewOpened: boolean;
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
            <Grid item className={classes.profileArea} data-tour-elem="profileArea">
              <Tooltip title={t('label.edit_profile_icon_title') || ''} placement="bottom">
                <span>
                  <IconButton
                    disabled={
                      isSnapshotting ||
                      !activeProfile ||
                      isInitiating ||
                      !profilesLoaded ||
                      !signalrOnline
                    }
                    aria-label="edit"
                    className={classes.iconButton}
                    onClick={() => handleProfileOpen(true)}
                    size="large"
                  >
                    <SettingsIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
              <FormControl className={classes.formControl}>
                <Select
                  disabled={isSnapshotting || isInitiating || !profilesLoaded || !signalrOnline}
                  className={classes.selectMenu}
                  value={getDropdownSelection(
                    mapDomainToDropdown(profiles),
                    activeProfile ? activeProfile.uuid : ''
                  )}
                  onChange={(e) => handleProfileChange(e)}
                  inputProps={{
                    name: 'profile',
                    id: 'profile-dd',
                  }}
                  variant="standard"
                >
                  {profiles.map((profile: Profile) => {
                    return (
                      <MenuItem key={profile.uuid} value={profile.uuid}>
                        {profile.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>

              <Tooltip title={t('label.create_profile_icon_title') || ''} placement="bottom">
                <span>
                  <IconButton
                    disabled={isSnapshotting || !profilesLoaded || isInitiating || !signalrOnline}
                    onClick={() => handleProfileOpen()}
                    aria-label="create"
                    className={classes.iconButton}
                    size="large"
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title={t('label.remove_profile_icon_title') || ''} placement="bottom">
                <span>
                  <IconButton
                    disabled={
                      isSnapshotting ||
                      profiles.length < 2 ||
                      isInitiating ||
                      !profilesLoaded ||
                      !signalrOnline
                    }
                    onClick={() => handleRemoveProfile()}
                    aria-label="remove profile"
                    className={classes.iconButton}
                    size="large"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            </Grid>
            <Grid item className={classes.divider} />
            <Grid item className={classes.snapshotArea} data-tour-elem="snapshotArea">
              <Button
                startIcon={<UpdateIcon />}
                variant="contained"
                size="small"
                color="primary"
                disabled={
                  !activeProfile ||
                  !activeProfile.readyToSnapshot ||
                  !signalrOnline ||
                  retryAfter > 0
                }
                onClick={() => handleSnapshot()}
                aria-label="snapshot"
                className={classes.snapshotBtn}
              >
                {t('label.fetch_snapshot_icon_title')}
              </Button>
              <Tooltip title={t('label.cancel_snapshot_icon_title') || ''} placement="bottom">
                <span>
                  <IconButton
                    disabled={!isSnapshotting}
                    onClick={() => handleCancelSnapshot()}
                    aria-label="cancelSnapshot"
                    className={classes.iconButton}
                    size="large"
                  >
                    <Cancel fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title={t('label.remove_snapshot_icon_title') || ''} placement="bottom">
                <span>
                  <IconButton
                    disabled={
                      !activeProfile ||
                      isSnapshotting ||
                      !signalrOnline ||
                      activeProfile.snapshots.length === 0
                    }
                    onClick={() => handleClearSnapshots()}
                    aria-label="clear snapshots"
                    className={classes.iconButton}
                    size="large"
                  >
                    <DeleteSweepIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            </Grid>
            <Grid item className={classes.divider} />
            <Grid item className={classes.overlayArea} data-tour-elem="overlayArea">
              <Tooltip title={t('label.overlay_icon_title') || ''} placement="bottom">
                <span>
                  <IconButton
                    onClick={() => handleOverlay()}
                    aria-label="overlay"
                    aria-haspopup="true"
                    className={clsx(classes.iconButton)}
                    size="large"
                  >
                    <AddToPhotosIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            </Grid>
            <Grid item className={classes.divider} />
            <Grid item className={classes.groupArea} data-tour-elem="groupArea">
              <Tooltip title={t('label.group_icon_title') || ''} placement="bottom">
                <span>
                  <IconButton
                    disabled={isSnapshotting || !signalrOnline}
                    onClick={() => toggleGroupOverview()}
                    aria-label="group"
                    aria-haspopup="true"
                    className={clsx(classes.iconButton)}
                    size="large"
                  >
                    <GroupIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            </Grid>
            <Grid item className={classes.divider} />
            <Grid item className={classes.miscArea}>
              <Tooltip title={t('label.notification_icon_title') || ''} placement="bottom">
                <span>
                  <IconButton
                    data-tour-elem="notificationList"
                    onClick={(e) => handleNotificationsOpen(e)}
                    aria-label="show new notifications"
                    color="inherit"
                    className={clsx(classes.iconButton)}
                    size="large"
                  >
                    <Badge
                      max={9}
                      badgeContent={
                        unreadNotifications.length > 0 ? unreadNotifications.length : undefined
                      }
                      classes={{ badge: classes.badge }}
                    >
                      <NotificationsIcon fontSize="small" />
                    </Badge>
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title={t('label.account_icon_title') || ''} placement="bottom">
                <span>
                  <IconButton
                    onClick={(e) => handleAccountMenuOpen(e)}
                    aria-label="account"
                    aria-haspopup="true"
                    disabled={isSnapshotting || isInitiating}
                    className={clsx(classes.iconButton)}
                    size="large"
                  >
                    <AccountCircle fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            </Grid>
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

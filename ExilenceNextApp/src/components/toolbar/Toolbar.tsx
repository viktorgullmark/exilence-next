import {
  AppBar,
  Badge,
  Box,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Tooltip,
} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import MuiToolbar from '@material-ui/core/Toolbar';
import AccountCircle from '@material-ui/icons/AccountCircle';
import AddIcon from '@material-ui/icons/Add';
import AddToPhotosIcon from '@material-ui/icons/AddToPhotos';
import DeleteIcon from '@material-ui/icons/Delete';
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';
import GroupIcon from '@material-ui/icons/Group';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import SettingsIcon from '@material-ui/icons/Settings';
import UpdateIcon from '@material-ui/icons/Update';
import WarningIcon from '@material-ui/icons/Warning';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import React, { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import PatreonLogo from '../../assets/img/patreon-white.png';
import { Notification } from '../../store/domains/notification';
import {
  getDropdownSelection,
  mapDomainToDropdown,
} from '../../utils/dropdown.utils';
import { openLink } from '../../utils/window.utils';
import AccountMenuContainer from '../account-menu/AccountMenuContainer';
import CreateGroupDialogContainer from '../group-dialog/GroupDialogContainer';
import NotificationListContainer from '../notification-list/NotificationListContainer';
import ProfileDialogContainer from '../profile-dialog/ProfileDialogContainer';
import StatusMessageContainer from '../status-message/StatusMessageContainer';
import ToolbarStepperContainer from '../toolbar-stepper/ToolbarStepperContainer';
import { Profile } from './../../store/domains/profile';
import useStyles from './Toolbar.styles';

export const innerToolbarHeight = 50;
export const patreonLogoHeight = 35;
export const patreonLogoWidth = 86;

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
  toggleSidenav: () => void;
  toggleGroupOverview: () => void;
  handleProfileOpen: (edit?: boolean) => void;
  handleProfileClose: () => void;
  handleProfileChange: (
    event: ChangeEvent<{ name?: string | undefined; value: unknown }>
  ) => void;
  handleSnapshot: () => void;
  handleOverlay: () => void;
  handleNotificationsOpen: (event: React.MouseEvent<HTMLElement>) => void;
  handleAccountMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
  handleClearSnapshots: () => void;
  handleRemoveProfile: () => void;
}

const Toolbar = ({
  signalrOnline,
  sidenavOpened,
  groupOverviewOpened,
  activeProfile,
  profiles,
  profileOpen,
  isEditing,
  isInitiating,
  unreadNotifications,
  isSnapshotting,
  isUpdatingPrices,
  profilesLoaded,
  changingProfile,
  toggleSidenav,
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
}: ToolbarProps) => {

  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <>
      <AppBar
        position='fixed'
        className={clsx(classes.appBar, {
          [classes.appBarShift]: sidenavOpened || groupOverviewOpened,
          [classes.fromLeft]: sidenavOpened,
          [classes.fromRight]: groupOverviewOpened,
        })}
      >
        <ToolbarStepperContainer />
        <MuiToolbar className={classes.toolbar}>
          <Tooltip title={t('label.toggle_menu_title')} placement='bottom'>
            <span>
              <IconButton
                color='inherit'
                aria-label='open drawer'
                onClick={() => toggleSidenav()}
                edge='start'
                className={clsx(sidenavOpened && classes.hide)}
              >
                <MenuIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Box
            display='flex'
            alignItems='center'
            justifyContent='center'
            height='1'
            mr={1.5}
            className={clsx({ [classes.marginLeft]: sidenavOpened })}
          >
            <a href='https://patreon.com/exilence' onClick={(e) => openLink(e)}>
              <Box display='flex' alignItems='center' height={1}>
                <img className={classes.patreonLogo} src={PatreonLogo} alt="patreon" />
              </Box>
            </a>
          </Box>
          {!signalrOnline && (
            <WarningIcon
              titleAccess={t('label.server_offline_title')}
              className={classes.offlineIcon}
            />
          )}
          {(isInitiating ||
            changingProfile ||
            isUpdatingPrices ||
            isSnapshotting) && (
            <Box
              ml={1}
              display='flex'
              alignItems='center'
              justifyContent='center'
            >
              <CircularProgress
                className={classes.leftSpinner}
                title={t('label.loading_title')}
                size={20}
              />
            </Box>
          )}

          <Box ml={2} display='flex' whiteSpace='nowrap'>
            <StatusMessageContainer />
          </Box>
          <Grid
            container
            alignItems='center'
            justify='flex-end'
            className={classes.toolbarGrid}
          >
            <Grid
              item
              className={classes.profileArea}
              data-tour-elem='profileArea'
            >
              <Tooltip
                title={t('label.edit_profile_icon_title')}
                placement='bottom'
              >
                <span>
                  <IconButton
                    disabled={
                      isSnapshotting ||
                      !activeProfile ||
                      isInitiating ||
                      !profilesLoaded ||
                      !signalrOnline
                    }
                    aria-label='edit'
                    className={classes.iconButton}
                    onClick={() => handleProfileOpen(true)}
                  >
                    <SettingsIcon fontSize='small' />
                  </IconButton>
                </span>
              </Tooltip>
              <FormControl className={classes.formControl}>
                <Select
                  disabled={
                    isSnapshotting ||
                    isInitiating ||
                    !profilesLoaded ||
                    !signalrOnline
                  }
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

              <Tooltip
                title={t('label.create_profile_icon_title')}
                placement='bottom'
              >
                <span>
                  <IconButton
                    disabled={
                      isSnapshotting ||
                      !profilesLoaded ||
                      isInitiating ||
                      !signalrOnline
                    }
                    onClick={() => handleProfileOpen()}
                    aria-label='create'
                    className={classes.iconButton}
                  >
                    <AddIcon fontSize='small' />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip
                title={t('label.remove_profile_icon_title')}
                placement='bottom'
              >
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
                    aria-label='remove profile'
                    className={classes.iconButton}
                  >
                    <DeleteIcon fontSize='small' />
                  </IconButton>
                </span>
              </Tooltip>
            </Grid>
            <Grid item className={classes.divider} />
            <Grid
              item
              className={classes.snapshotArea}
              data-tour-elem='snapshotArea'
            >
              <Tooltip
                title={t('label.fetch_snapshot_icon_title')}
                placement='bottom'
              >
                <span>
                  <IconButton
                    disabled={
                      !activeProfile ||
                      !activeProfile.readyToSnapshot ||
                      !signalrOnline
                    }
                    onClick={() => handleSnapshot()}
                    aria-label='snapshot'
                    className={classes.iconButton}
                  >
                    <UpdateIcon fontSize='small' />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip
                title={t('label.remove_snapshot_icon_title')}
                placement='bottom'
              >
                <span>
                  <IconButton
                    disabled={
                      !activeProfile ||
                      isSnapshotting ||
                      !signalrOnline ||
                      activeProfile.snapshots.length === 0
                    }
                    onClick={() => handleClearSnapshots()}
                    aria-label='clear snapshots'
                    className={classes.iconButton}
                  >
                    <DeleteSweepIcon fontSize='small' />
                  </IconButton>
                </span>
              </Tooltip>
            </Grid>
            <Grid item className={classes.divider} />
            <Grid
              item
              className={classes.overlayArea}
              data-tour-elem='overlayArea'
            >
              <Tooltip title={t('label.overlay_icon_title')} placement='bottom'>
                <span>
                  <IconButton
                    onClick={() => handleOverlay()}
                    aria-label='overlay'
                    aria-haspopup='true'
                    className={clsx(classes.iconButton)}
                  >
                    <AddToPhotosIcon fontSize='small' />
                  </IconButton>
                </span>
              </Tooltip>
            </Grid>
            <Grid item className={classes.divider} />
            <Grid item className={classes.groupArea} data-tour-elem='groupArea'>
              <Tooltip title={t('label.group_icon_title')} placement='bottom'>
                <span>
                  <IconButton
                    disabled={isSnapshotting || !signalrOnline}
                    onClick={() => toggleGroupOverview()}
                    aria-label='group'
                    aria-haspopup='true'
                    className={clsx(classes.iconButton)}
                  >
                    <GroupIcon fontSize='small' />
                  </IconButton>
                </span>
              </Tooltip>
            </Grid>
            <Grid item className={classes.divider} />
            <Grid item className={classes.miscArea}>
              <Tooltip
                title={t('label.notification_icon_title')}
                placement='bottom'
              >
                <span>
                  <IconButton
                    data-tour-elem='notificationList'
                    onClick={(e) => handleNotificationsOpen(e)}
                    aria-label='show new notifications'
                    color='inherit'
                    className={clsx(classes.iconButton)}
                  >
                    <Badge
                      max={9}
                      badgeContent={
                        unreadNotifications.length > 0
                          ? unreadNotifications.length
                          : undefined
                      }
                      classes={{ badge: classes.badge }}
                    >
                      <NotificationsIcon fontSize='small' />
                    </Badge>
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title={t('label.account_icon_title')} placement='bottom'>
                <span>
                  <IconButton
                    onClick={(e) => handleAccountMenuOpen(e)}
                    aria-label='account'
                    aria-haspopup='true'
                    className={clsx(classes.iconButton)}
                  >
                    <AccountCircle fontSize='small' />
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

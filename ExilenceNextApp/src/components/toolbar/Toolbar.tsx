import {
  AppBar,
  Avatar,
  Badge,
  FormControl,
  Grid,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
  Select,
  Typography
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles, Theme } from '@material-ui/core/styles';
import MuiToolbar from '@material-ui/core/Toolbar';
import AccountCircle from '@material-ui/icons/AccountCircle';
import AddIcon from '@material-ui/icons/Add';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import SettingsIcon from '@material-ui/icons/Settings';
import UpdateIcon from '@material-ui/icons/Update';
import WarningIcon from '@material-ui/icons/Warning';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import moment from 'moment';
import React, { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';
import { primaryGradient } from '../../assets/themes/exilence-theme';
import { Notification } from '../../store/domains/notification';
import Dd from '../../utils/dropdown.utils';
import { toolbarHeight } from '../header/Header';
import ProfileDialogContainer from '../profile-dialog/ProfileDialogContainer';
import { drawerWidth } from '../sidenav/SideNav';
import { Profile } from './../../store/domains/profile';
import { resizeHandleContainerHeight } from './../header/Header';
import DeleteIcon from '@material-ui/icons/Delete';
import CircularProgress from '@material-ui/core/CircularProgress';
export const innerToolbarHeight = 50;

const useStyles = makeStyles((theme: Theme) => ({
  appBar: {
    background: primaryGradient,
    top: toolbarHeight + resizeHandleContainerHeight,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  toolbar: {
    maxHeight: innerToolbarHeight,
    minHeight: innerToolbarHeight
  },
  hide: {
    display: 'none'
  },
  windowIcon: {
    fontSize: 14,
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    cursor: 'pointer'
  },
  selectMenu: {
    fontSize: '0.9rem'
  },
  iconButton: {
    padding: theme.spacing(0.5)
  },
  toolbarGrid: {
    maxHeight: innerToolbarHeight,
    minHeight: innerToolbarHeight
  },
  profileArea: {
    padding: `0 ${theme.spacing(1)}px`
  },
  snapshotArea: {
    padding: `0 ${theme.spacing(1)}px`
  },
  miscArea: {
    padding: `0 ${theme.spacing(1)}px`
  },
  formControl: {
    padding: `0 ${theme.spacing(0.5)}px`
  },
  divider: {
    height: innerToolbarHeight,
    borderLeft: `1px solid ${theme.palette.primary.dark}`
  },
  notification: {
    paddingTop: 0,
    paddingBottom: theme.spacing(0.25),
    '&:focus': {
      outline: 'none'
    }
  },
  notificationTimestamp: {
    display: 'inline'
  },
  spinner: {
    color: theme.palette.primary.contrastText
  }
}));

interface Props {
  sidenavOpened: boolean;
  activeProfile: Profile;
  profiles: Profile[];
  profileOpen: boolean;
  isEditing: boolean;
  notifications: Notification[];
  unreadNotifications: Notification[];
  isSnapshotting: boolean;
  toggleSidenav: () => void;
  markAllNotificationsRead: () => void;
  handleProfileOpen: (edit?: boolean) => void;
  handleProfileClose: () => void;
  handleProfileChange: (
    event: ChangeEvent<{ name?: string | undefined; value: unknown }>
  ) => void;
  handleSnapshot: () => void;
  handleClearSnapshots: () => void;
}

const Toolbar: React.FC<Props> = (props: Props) => {
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();
  const { t } = useTranslation();

  const [menuNotifications, setMenuNotifications] = useState<Notification[]>(
    []
  );

  const [accountEl, setAccountEl] = React.useState<null | HTMLElement>(null);
  const [notifEl, setNotifEl] = React.useState<null | HTMLElement>(null);
  const accountMenuOpen = Boolean(accountEl);
  const notificationsMenuOpen = Boolean(notifEl);

  const handleAccountMenuClose = () => {
    setAccountEl(null);
  };

  const handleNotifMenuClose = () => {
    setNotifEl(null);
  };

  const atLoginRoute = () => {
    return location.pathname === '/login';
  };

  const handleAccountMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAccountEl(event.currentTarget);
  };

  const handleNotificationsMenuOpen = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    setMenuNotifications([...props.notifications]);
    props.markAllNotificationsRead();
    setNotifEl(event.currentTarget);
  };

  const handleSignOut = () => {
    history.push('/login');
  };

  const renderMenu = (
    <Menu
      anchorEl={accountEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id="account-menu"
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={accountMenuOpen}
      onClose={handleAccountMenuClose}
    >
      <MenuItem onClick={handleSignOut}>{t('label.sign_out')}</MenuItem>
    </Menu>
  );

  const notificationIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <ErrorIcon />;
      case 'warning':
        return <WarningIcon />;
      default:
        return <InfoIcon />;
    }
  };

  const renderNotifications = (
    <Menu
      anchorEl={notifEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id="notifications-menu"
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={notificationsMenuOpen}
      onClose={handleNotifMenuClose}
    >
      {menuNotifications.map(n => {
        return (
          <ListItem key={n.uuid} className={classes.notification}>
            <ListItemAvatar>
              <Avatar>{notificationIcon(n.type)}</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={t(n.title, { param: n.translateParam })}
              secondary={
                <>
                  <Typography
                    component="span"
                    variant="body2"
                    className={classes.notificationTimestamp}
                  >
                    {moment(n.timestamp).format('MM-DD, LT')}
                  </Typography>
                  {/* temporary disabled {` — ${t(n.description, { param: n.translateParam })}`} */}
                </>
              }
            />
          </ListItem>
        );
      })}
    </Menu>
  );

  return (
    <>
      {!atLoginRoute() && (
        <>
          <AppBar
            position="fixed"
            color="secondary"
            className={clsx(classes.appBar, {
              [classes.appBarShift]: props.sidenavOpened
            })}
          >
            <MuiToolbar className={classes.toolbar}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={() => props.toggleSidenav()}
                edge="start"
                className={clsx(props.sidenavOpened && classes.hide)}
              >
                <MenuIcon />
              </IconButton>
              <Grid
                container
                alignItems="center"
                justify="flex-end"
                className={classes.toolbarGrid}
              >
                <Grid item className={classes.profileArea}>
                  <FormControl className={classes.formControl}>
                    <Select
                      className={classes.selectMenu}
                      value={Dd.getDropdownSelection(
                        Dd.mapDomainToDropdown(props.profiles),
                        props.activeProfile.uuid
                      )}
                      onChange={e => props.handleProfileChange(e)}
                      inputProps={{
                        name: 'profile',
                        id: 'profile-dd'
                      }}
                    >
                      {props.profiles.map((profile: Profile) => {
                        return (
                          <MenuItem key={profile.uuid} value={profile.uuid}>
                            {profile.name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  <IconButton
                    aria-label="edit"
                    className={classes.iconButton}
                    onClick={() => props.handleProfileOpen(true)}
                    title={t('label.edit_profile_icon_title')}
                  >
                    <SettingsIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    onClick={() => props.handleProfileOpen()}
                    aria-label="create"
                    className={classes.iconButton}
                    title={t('label.create_profile_icon_title')}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Grid>
                <Grid item className={classes.divider}></Grid>
                <Grid item className={classes.snapshotArea}>
                  <IconButton
                    disabled={!props.activeProfile.readyToSnapshot}
                    onClick={() => props.handleSnapshot()}
                    aria-label="snapshot"
                    className={classes.iconButton}
                    title={t('label.fetch_snapshot_icon_title')}
                  >
                    {!props.isSnapshotting ? (
                      <UpdateIcon fontSize="small" />
                    ) : (
                      <CircularProgress className={classes.spinner} size={20} />
                    )}
                  </IconButton>
                  {props.activeProfile.snapshots.length > 0 && (
                    <IconButton
                      disabled={props.activeProfile.isSnapshotting}
                      onClick={() => props.handleClearSnapshots()}
                      aria-label="clear snapshots"
                      className={classes.iconButton}
                      title={t('label.remove_snapshot_icon_title')}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Grid>
                <Grid item className={classes.divider}></Grid>
                <Grid item className={classes.miscArea}>
                  <IconButton
                    onClick={handleNotificationsMenuOpen}
                    aria-label="show new notifications"
                    color="inherit"
                    className={clsx(classes.iconButton)}
                    title={t('label.notification_icon_title')}
                  >
                    <Badge
                      max={9}
                      badgeContent={
                        props.unreadNotifications.length > 0
                          ? props.unreadNotifications.length
                          : undefined
                      }
                      color="secondary"
                    >
                      <NotificationsIcon fontSize="small" />
                    </Badge>
                  </IconButton>
                  <IconButton
                    onClick={handleAccountMenuOpen}
                    aria-label="account"
                    aria-haspopup="true"
                    className={clsx(classes.iconButton)}
                    title={t('label.account_icon_title')}
                  >
                    <AccountCircle fontSize="small" />
                  </IconButton>
                </Grid>
              </Grid>
            </MuiToolbar>
          </AppBar>
          {renderMenu}
          {renderNotifications}
          <ProfileDialogContainer
            profile={props.activeProfile}
            isOpen={props.profileOpen}
            isEditing={props.isEditing}
            handleClickClose={props.handleProfileClose}
            handleClickOpen={props.handleProfileOpen}
          />
        </>
      )}
    </>
  );
};

export default observer(Toolbar);

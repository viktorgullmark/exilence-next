import { AppBar, FormControl, Grid, MenuItem, Select } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles, Theme } from '@material-ui/core/styles';
import MuiToolbar from '@material-ui/core/Toolbar';
import AddIcon from '@material-ui/icons/Add';
import MenuIcon from '@material-ui/icons/Menu';
import SettingsIcon from '@material-ui/icons/Settings';
import UpdateIcon from '@material-ui/icons/Update';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import React from 'react';
import { useLocation } from 'react-router';
import { DropdownHelper } from '../../helpers/dropdown.helper';
import { toolbarHeight } from '../header/Header';
import ProfileDialogContainer from '../profile-dialog/ProfileDialogContainer';
import { drawerWidth } from '../sidenav/SideNav';
import { Profile } from './../../store/domains/profile';
import { resizeHandleContainerHeight } from './../header/Header';

export const innerToolbarHeight = 50;

const useStyles = makeStyles((theme: Theme) => ({
  appBar: {
    background: theme.palette.primary.dark,
    top: toolbarHeight + resizeHandleContainerHeight,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  title: {
    flexGrow: 1,
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '4px',
    color: theme.palette.primary.dark,
    fontWeight: 700
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
  iconButtonContainer: {
    margin: `0 ${theme.spacing(0.5)}px 0 ${theme.spacing(0.5)}px`
  },
  iconButton: {
    padding: theme.spacing(0.5)
  },
  toolbarGrid: {
    maxHeight: innerToolbarHeight,
    minHeight: innerToolbarHeight
  }
}));

interface Props {
  sidenavOpened: boolean;
  activeProfile: Profile;
  profiles: Profile[];
  profileOpen: boolean;
  isEditing: boolean;
  toggleSidenav: Function;
  handleProfileOpen: Function;
  handleProfileClose: Function;
  handleProfileChange: Function;
  handleSnapshot: Function;
}

const Toolbar: React.FC<Props> = (props: Props) => {
  const classes = useStyles();
  const location = useLocation();

  const atLoginRoute = () => {
    return location.pathname === '/login';
  };

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
                <Grid item>
                  <FormControl>
                    <Select
                      className={classes.selectMenu}
                      value={DropdownHelper.getDropdownSelection(
                        props.profiles,
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
                </Grid>
                <Grid item>
                  <div className={classes.iconButtonContainer}>
                    <IconButton
                      aria-label="edit"
                      className={classes.iconButton}
                      onClick={() => props.handleProfileOpen(true)}
                    >
                      <SettingsIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={() => props.handleProfileOpen()}
                      aria-label="create"
                      className={classes.iconButton}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={() => props.handleSnapshot()}
                      aria-label="snapshot"
                      className={classes.iconButton}
                    >
                      <UpdateIcon fontSize="small" />
                    </IconButton>
                  </div>
                </Grid>
              </Grid>
            </MuiToolbar>
          </AppBar>
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

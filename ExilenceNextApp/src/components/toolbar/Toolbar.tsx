import {
  AppBar,
  Select,
  FormControl,
  InputLabel,
  Grid,
  MenuItem,
  Fab,
  Button
} from '@material-ui/core';
import MuiToolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles, Theme } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import React from 'react';
import { useLocation } from 'react-router';
import { drawerWidth } from '../sidenav/SideNav';
import { toolbarHeight } from '../header/Header';
import { useTranslation } from 'react-i18next';
import AddIcon from '@material-ui/icons/Add';
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
  iconButton: {
    padding: theme.spacing(0.5),
    margin: `0 ${theme.spacing(0.5)}px 0 ${theme.spacing(0.5)}px` 
  },
  toolbarGrid: {
    maxHeight: innerToolbarHeight,
    minHeight: innerToolbarHeight
  }
}));

interface ToolbarProps {
  sidenavOpened: boolean;
  toggleSidenav: Function;
}

const Toolbar: React.FC<ToolbarProps> = (props: ToolbarProps) => {
  const classes = useStyles();
  const location = useLocation();
  const { t } = useTranslation();

  const atLoginRoute = () => {
    return location.pathname === '/login';
  };

  const handleProfileChange = (profileUuid: string) => {
    console.log(profileUuid);
  };

  // todo: remove mock
  const profiles = [
    { name: 'Profile 1', uuid: '123' },
    { name: 'Profile 2', uuid: '345' },
    { name: 'Profile 3', uuid: '456' }
  ];

  return (
    <>
      {!atLoginRoute() && (
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
            <Grid container alignItems="center" justify="flex-end" className={classes.toolbarGrid}>
              <Grid item>
                <FormControl>
                  <Select
                    className={classes.selectMenu}
                    value="123"
                    inputProps={{
                      name: 'profile',
                      id: 'profile-dd'
                    }}
                  >
                    {profiles.map((profile: any) => {
                      return (
                        <MenuItem key={profile.uuid} value={profile.uuid}>
                          {profile.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                <IconButton aria-label="create" className={classes.iconButton}>
                  <AddIcon fontSize="small" />
                </IconButton>
              </Grid>
            </Grid>
          </MuiToolbar>
        </AppBar>
      )}
    </>
  );
};

export default observer(Toolbar);

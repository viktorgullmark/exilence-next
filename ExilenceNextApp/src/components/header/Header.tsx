import { AppBar, Toolbar } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CloseIcon from '@material-ui/icons/Close';
import FilterNone from '@material-ui/icons/FilterNone';
import MenuIcon from '@material-ui/icons/Menu';
import MinimizeIcon from '@material-ui/icons/Minimize';
import clsx from 'clsx';
import React from 'react';
import { WindowHelper } from './../../helpers/window.helper';
import { observer } from 'mobx-react';
import { drawerWidth } from './../sidenav/SideNav';

export const resizeHandleContainerHeight = 5;
export const toolbarHeight = 30;

const useStyles = makeStyles((theme: Theme) => ({
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  toolbar: {
    minHeight: toolbarHeight,
    maxHeight: toolbarHeight,
    '-webkit-app-region': 'drag',
    paddingBottom: resizeHandleContainerHeight
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  hide: {
    display: 'none'
  },
  resizeHandleContainer: {
    height: resizeHandleContainerHeight
  },
  noDrag: {
    '-webkit-app-region': 'no-drag'
  },
  windowIcon: {
    fontSize: 14,
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    cursor: 'pointer'
  }
}));

interface HeaderProps {
  maximized: boolean;
  setMaximized: Function;
  sidenavOpened: boolean;
  toggleSidenav: Function;
}

const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
  const classes = useStyles();

  const handleDrawerOpen = () => {
    console.log('should open');
  };

  return (
    <AppBar
      position="fixed"
      color="secondary"
      className={clsx(classes.appBar, {
        [classes.appBarShift]: props.sidenavOpened
      })}
    >
      <div
        className={clsx(classes.noDrag, classes.resizeHandleContainer)}
      ></div>
      <Toolbar className={classes.toolbar}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={() => props.toggleSidenav()}
          edge="start"
          className={clsx(
            classes.menuButton,
            classes.noDrag,
            props.sidenavOpened && classes.hide
          )}
        >
          <MenuIcon />
        </IconButton>
        <Grid
          container
          direction="row"
          justify="flex-end"
          alignItems="flex-end"
        >
          <Grid item className={clsx(classes.noDrag)}>
            <MinimizeIcon
              className={classes.windowIcon}
              onClick={() => WindowHelper.minimize()}
            />
            {!props.maximized ? (
              <CheckBoxOutlineBlankIcon
                className={classes.windowIcon}
                onClick={() => {
                  WindowHelper.maximize();
                  props.setMaximized(true);
                }}
              />
            ) : (
              <FilterNone
                className={classes.windowIcon}
                onClick={() => {
                  WindowHelper.unmaximize();
                  props.setMaximized(false);
                }}
              />
            )}
            <CloseIcon
              className={classes.windowIcon}
              onClick={() => WindowHelper.close()}
            />
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default observer(Header);

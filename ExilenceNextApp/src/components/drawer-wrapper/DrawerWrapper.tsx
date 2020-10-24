import React, { ReactNode } from 'react';
import { useLocation } from 'react-router';
import { Box } from '@material-ui/core';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import clsx from 'clsx';
import { observer } from 'mobx-react';

import { background } from '../../assets/themes/exilence-theme';
import { resizeHandleContainerHeight, toolbarHeight } from '../header/Header';
import { innerToolbarHeight } from '../toolbar/Toolbar';
import GroupOverviewContainer from './group-overview/GroupOverviewContainer';
import NavigationMenuContainer from './navigation-menu/NavigationMenuContainer';

export const drawerWidth = 300;

const topMargin = toolbarHeight + (innerToolbarHeight || 0) + resizeHandleContainerHeight;

const useStyles = makeStyles((theme: Theme) => ({
  content: {
    height: `calc(100% - ${topMargin}px - ${theme.spacing(2.25)}px)`,
    overflowY: 'scroll',
    overflowX: 'hidden',
    marginTop: topMargin,
    marginBottom: theme.spacing(2.25),
    padding: theme.spacing(1),
    paddingBottom: 0,
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  fromRight: {
    marginRight: drawerWidth,
  },
  fromLeft: {
    marginLeft: drawerWidth,
  },
  windowBottomBorder: {
    background: background.darker,
  },
}));

type DrawerWrapperProps = {
  navMenuOpen: boolean;
  groupOverviewOpen: boolean;
  children: ReactNode;
};

const DrawerWrapper = ({ navMenuOpen, groupOverviewOpen, children }: DrawerWrapperProps) => {
  const classes = useStyles();
  const location = useLocation();
  const theme = useTheme();

  const atLoginRoute = () => {
    return location.pathname === '/login';
  };

  return (
    <>
      {!atLoginRoute() && (
        <>
          <NavigationMenuContainer />
          <GroupOverviewContainer />
        </>
      )}
      {!atLoginRoute() && (
        <main
          className={clsx(classes.content, {
            [classes.contentShift]: navMenuOpen || (groupOverviewOpen && !atLoginRoute()),
            [classes.fromLeft]: navMenuOpen,
            [classes.fromRight]: groupOverviewOpen,
          })}
        >
          {children}
          <Box
            className={classes.windowBottomBorder}
            display="block"
            width="1"
            height={theme.spacing(2.25)}
            zIndex="100"
            bottom="0"
            left="0"
            position="fixed"
          />
        </main>
      )}
    </>
  );
};

export default observer(DrawerWrapper);

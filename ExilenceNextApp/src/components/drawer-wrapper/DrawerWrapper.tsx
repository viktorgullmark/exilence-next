import { Box } from '@mui/material';
import { Theme, useTheme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import React, { ReactNode } from 'react';
import { useLocation } from 'react-router';
import { background } from '../../assets/themes/exilence-theme';
import { resizeHandleContainerHeight, toolbarHeight } from '../header/Header';
import GroupOverviewContainer from './group-overview/GroupOverviewContainer';
import {
  collapsedNavigationMenuWidth,
  navigationMenuWidth,
} from './navigation-menu/NavigationMenu.styles';
import NavigationMenuContainer from './navigation-menu/NavigationMenuContainer';

export const innerToolbarHeight = 50;
export const drawerWidth = 300;

const topMargin = toolbarHeight + (innerToolbarHeight || 0) + resizeHandleContainerHeight;

const useStyles = makeStyles((theme: Theme) => ({
  content: {
    height: `calc(100% - ${topMargin}px - ${theme.spacing(2.25)})`,
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
    marginLeft: collapsedNavigationMenuWidth,
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
    marginLeft: navigationMenuWidth,
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

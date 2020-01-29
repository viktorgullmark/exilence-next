import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import React from 'react';
import { useLocation } from 'react-router';
import { resizeHandleContainerHeight, toolbarHeight } from '../header/Header';
import { innerToolbarHeight } from '../toolbar/Toolbar';
import GroupOverviewContainer from './group-overview/GroupOverviewContainer';
import NavigationMenuContainer from './navigation-menu/NavigationMenuContainer';
import { Box } from '@material-ui/core';
import { background } from '../../assets/themes/exilence-theme';

export const drawerWidth = 300;

const useStyles = makeStyles((theme: Theme) => ({
  content: {
    height: `100%`,
    overflow: 'scroll',
    padding: `calc(${toolbarHeight}px + ${innerToolbarHeight}px + ${resizeHandleContainerHeight}px + ${theme.spacing(
      1
    )}px) 
    ${theme.spacing(1)}px ${theme.spacing(1)}px ${theme.spacing(1)}px`,
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: 0
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  fromRight: {
    marginRight: drawerWidth
  },
  fromLeft: {
    marginLeft: drawerWidth
  },
  windowBottomBorder: {
    background: background.darker
  }
}));

interface DrawerWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  navMenuOpen: boolean;
  groupOverviewOpen: boolean;
}

const DrawerWrapper: React.FC<DrawerWrapperProps> = ({
  navMenuOpen,
  groupOverviewOpen,
  children
}: DrawerWrapperProps) => {
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
            [classes.contentShift]:
              navMenuOpen || (groupOverviewOpen && !atLoginRoute()),
            [classes.fromLeft]: navMenuOpen,
            [classes.fromRight]: groupOverviewOpen
          })}
        >
          {children}
          <Box
            className={classes.windowBottomBorder}
            display="block"
            width="1"
            height={theme.spacing(2)}
            zIndex="100"
            bottom="0"
            left="0"
            position="fixed"
          ></Box>
        </main>
      )}
    </>
  );
};

export default observer(DrawerWrapper);

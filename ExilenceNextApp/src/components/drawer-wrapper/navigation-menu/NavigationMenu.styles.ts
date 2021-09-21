import { makeStyles } from '@material-ui/core';

import { resizeHandleContainerHeight, toolbarHeight } from '../../header/Header';
import { innerToolbarHeight } from '../DrawerWrapper';

export const navigationMenuWidth = 240;
export const collapsedNavigationMenuWidth = 57;
const useStyles = makeStyles((theme) => ({
  drawer: {
    width: navigationMenuWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerPaper: {
    height: `calc(100% - ${toolbarHeight}px)`,
    top: `calc(${toolbarHeight}px + ${resizeHandleContainerHeight}px)`,
    width: navigationMenuWidth,
    background: theme.palette.background.default,
  },
  drawerHeader: {
    height: innerToolbarHeight,
    background: theme.palette.background.default,
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    justifyContent: 'center',
  },
  drawerHeaderOpen: {
    justifyContent: 'flex-end',
  },
  drawerOpen: {
    width: navigationMenuWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: collapsedNavigationMenuWidth,
  },
  new: {
    color: 'lime',
    fontSize: 10,
    background: theme.palette.background.default,
    position: 'absolute',
    borderRadius: 4,
    top: 6,
    right: 2,
    padding: '0 2px',
  },
}));

export default useStyles;

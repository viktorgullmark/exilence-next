import makeStyles from '@mui/styles/makeStyles';

import { resizeHandleContainerHeight, toolbarHeight } from '../../header/Header';
import { innerToolbarHeight } from '../DrawerWrapper';
import { primaryLighter } from '../../../assets/themes/exilence-theme';

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
    color: primaryLighter,
    fontSize: 10,
    background: theme.palette.background.default,
    position: 'absolute',
    borderRadius: 4,
    top: 6,
    right: 2,
    padding: '0 2px',
    border: `1px solid ${primaryLighter}`,
    boxShadow: `-4px 4px 10px ${theme.palette.background.default}`,
  },
}));

export default useStyles;

import { Theme } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { primaryGradient, statusColors } from '../../assets/themes/exilence-theme';
import { drawerWidth, innerToolbarHeight } from '../drawer-wrapper/DrawerWrapper';
import {
  collapsedNavigationMenuWidth,
  navigationMenuWidth,
} from '../drawer-wrapper/navigation-menu/NavigationMenu.styles';
import { resizeHandleContainerHeight, toolbarHeight } from '../header/Header';

const useStyles = makeStyles((theme: Theme) => ({
  appBar: {
    background: primaryGradient,
    top: toolbarHeight + resizeHandleContainerHeight,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  fromLeft: {
    width: `calc(100% - ${navigationMenuWidth}px)`,
    marginLeft: navigationMenuWidth + theme.spacing(1),
    paddingLeft: theme.spacing(1),
  },
  fromRight: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginRight: drawerWidth,
  },
  baseMargin: {
    marginLeft: theme.spacing(8),
  },
  marginLeft: {
    marginLeft: theme.spacing(1) + collapsedNavigationMenuWidth,
  },
  toolbar: {
    maxHeight: innerToolbarHeight,
    minHeight: innerToolbarHeight,
  },
  hide: {
    display: 'none',
  },
  windowIcon: {
    fontSize: 14,
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    cursor: 'pointer',
  },
  iconButton: {
    padding: theme.spacing(0.5),
  },
  toolbarGrid: {
    maxHeight: innerToolbarHeight,
    minHeight: innerToolbarHeight,
  },
  logMonitorArea: {
    padding: `0 ${theme.spacing(1)}`,
  },
  divider: {
    height: innerToolbarHeight,
    borderLeft: `1px solid ${theme.palette.secondary.light}`,
  },
  spinner: {
    color: theme.palette.primary.contrastText,
  },
  leftSpinner: {
    color: theme.palette.primary.contrastText,
  },
  offlineIcon: {
    marginRight: theme.spacing(1),
    color: statusColors.warning,
  },
}));

export default useStyles;

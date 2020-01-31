import { makeStyles, Theme } from '@material-ui/core';
import {
  primaryGradient,
  statusColors
} from '../../assets/themes/exilence-theme';
import { drawerWidth } from '../drawer-wrapper/DrawerWrapper';
import { resizeHandleContainerHeight, toolbarHeight } from '../header/Header';
import { innerToolbarHeight } from './Toolbar';

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
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  fromLeft: {
    marginLeft: drawerWidth
  },
  fromRight: {
    marginRight: drawerWidth
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
  groupArea: {
    padding: `0 ${theme.spacing(1)}px`
  },
  formControl: {
    padding: `0 ${theme.spacing(0.5)}px`
  },
  divider: {
    height: innerToolbarHeight,
    borderLeft: `1px solid ${theme.palette.primary.dark}`
  },
  spinner: {
    color: theme.palette.primary.contrastText
  },
  leftSpinner: {
    marginLeft: theme.spacing(1),
    color: theme.palette.primary.contrastText
  },
  badge: {
    backgroundColor: theme.palette.secondary.dark
  },
  offlineIcon: {
    marginRight: theme.spacing(1),
    color: statusColors.warning
  }
}));

export default useStyles;

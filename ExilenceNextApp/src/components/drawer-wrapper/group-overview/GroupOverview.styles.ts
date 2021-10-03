import makeStyles from '@mui/styles/makeStyles';

import { resizeHandleContainerHeight, toolbarHeight } from '../../header/Header';
import { drawerWidth } from '../DrawerWrapper';

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    height: `calc(100% - ${toolbarHeight}px)`,
    top: `calc(${toolbarHeight}px + ${resizeHandleContainerHeight}px)`,
    width: drawerWidth,
    background: theme.palette.background.default,
  },
  drawerHeader: {
    background: theme.palette.background.default,
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    justifyContent: 'flex-start',
  },
  groupName: {
    textAlign: 'center',
  },
}));

export default useStyles;

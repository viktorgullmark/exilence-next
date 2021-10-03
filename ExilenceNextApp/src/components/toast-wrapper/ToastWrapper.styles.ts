import { Theme } from '@mui/material';

import makeStyles from '@mui/styles/makeStyles';

import { drawerWidth, innerToolbarHeight } from '../drawer-wrapper/DrawerWrapper';
import { resizeHandleContainerHeight, toolbarHeight } from '../header/Header';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    top: toolbarHeight + resizeHandleContainerHeight + theme.spacing(2),
    width: 350,
  },
  authorized: {
    top: toolbarHeight + resizeHandleContainerHeight + innerToolbarHeight + theme.spacing(2),
  },
  rightMargin: {
    right: drawerWidth + theme.spacing(2),
  },
}));

export default useStyles;

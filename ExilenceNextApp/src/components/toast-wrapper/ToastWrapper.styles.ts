import { Theme } from '@mui/material';

import makeStyles from '@mui/styles/makeStyles';

import { drawerWidth, innerToolbarHeight } from '../drawer-wrapper/DrawerWrapper';
import { resizeHandleContainerHeight, toolbarHeight } from '../header/Header';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    top: toolbarHeight + resizeHandleContainerHeight + parseInt(theme.spacing(2)),
    width: 350,
    right: parseInt(theme.spacing(4)),
  },
  authorized: {
    top:
      toolbarHeight + resizeHandleContainerHeight + innerToolbarHeight + parseInt(theme.spacing(2)),
  },
  rightMargin: {
    right: drawerWidth + parseInt(theme.spacing(4)),
  },
}));

export default useStyles;

import { makeStyles } from '@material-ui/core';
import { gridSpacing } from '../../assets/themes/exilence-theme';
import { resizeHandleContainerHeight, toolbarHeight } from '../header/Header.styles';
import { innerToolbarHeight } from '../toolbar/Toolbar.styles';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: `calc(100vh - ${toolbarHeight}px - ${resizeHandleContainerHeight}px - ${innerToolbarHeight}px - ${theme.spacing(
      gridSpacing * 2
    )}px)`
  },
  tabs: {
    minWidth: 160,
    borderRight: `1px solid ${theme.palette.divider}`
  },
  tab: {
    minWidth: 'auto'
  },
  indicator: {
    backgroundColor: theme.palette.primary.light
  },
  subSection: {
    marginBottom: theme.spacing(5)
  }
}));

export default useStyles;

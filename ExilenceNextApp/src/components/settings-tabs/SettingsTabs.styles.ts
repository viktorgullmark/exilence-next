import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    minHeight: 800,
  },
  tabs: {
    minWidth: 160,
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  tab: {
    minWidth: 'auto',
  },
  indicator: {
    backgroundColor: theme.palette.primary.light,
  },
  subSection: {
    marginBottom: theme.spacing(5),
  },
}));

export default useStyles;

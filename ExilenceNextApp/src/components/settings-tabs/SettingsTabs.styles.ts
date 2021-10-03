import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    minHeight: 1000,
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

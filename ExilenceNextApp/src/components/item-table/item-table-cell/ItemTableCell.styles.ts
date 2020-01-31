import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  tableCell: {
    padding: theme.spacing(0.75),
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  iconCell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(0.5)
  },
  lastCell: {
    paddingRight: theme.spacing(1)
  },
  iconImg: {
    minHeight: 35,
    maxHeight: 35,
    maxWidth: 120
  },
  noLinks: {
    color: theme.palette.text.hint
  }
}));

export default useStyles;

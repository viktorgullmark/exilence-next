import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  iconCellInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  tableCell: {
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  iconCell: {
    padding: theme.spacing(0.75)
  },
  lastCell: {
    paddingRight: theme.spacing(1)
  },
  iconImg: {
    minHeight: 26,
    maxHeight: 26,
    maxWidth: 120
  },
  noLinks: {
    color: theme.palette.text.hint
  }
}));

export default useStyles;

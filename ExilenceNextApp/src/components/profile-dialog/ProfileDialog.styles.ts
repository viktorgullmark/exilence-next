import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  dialogContent: {
    minWidth: 500,
    maxWidth: 500
  },
  dialogActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    margin: theme.spacing(2, 0)
  }
}));

export default useStyles;

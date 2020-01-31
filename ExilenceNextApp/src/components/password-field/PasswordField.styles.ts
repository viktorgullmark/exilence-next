import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: theme.spacing(2)
  },
  helperText: {
    fontSize: '0.75rem',
    lineHeight: '1.2em'
  }
}));

export default useStyles;

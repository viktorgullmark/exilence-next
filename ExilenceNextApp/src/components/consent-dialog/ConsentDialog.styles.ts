import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  dialogActions: {
    padding: theme.spacing(2)
  },
  consent: {
    color: theme.palette.text.hint
  }
}));

export default useStyles;

import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  dialogActions: {
    padding: theme.spacing(2),
  },
  consent: {
    color: theme.palette.text.hint,
  },
  formField: {
    marginBottom: theme.spacing(2),
  },
  helperIcon: {},
}));

export default useStyles;

import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  dialogActions: {
    padding: theme.spacing(2),
  },
  consent: {
    color: theme.palette.text.disabled,
  },
  formField: {
    marginBottom: theme.spacing(2),
  },
  helperIcon: {},
}));

export default useStyles;

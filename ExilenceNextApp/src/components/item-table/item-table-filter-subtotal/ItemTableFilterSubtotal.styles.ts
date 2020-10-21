import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(1),
    color: theme.palette.text.secondary,
    display: 'flex',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export default useStyles;

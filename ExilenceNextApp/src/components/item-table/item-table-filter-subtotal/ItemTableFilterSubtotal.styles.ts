import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    color: theme.palette.text.secondary,
    display: 'flex',
    borderRadius: 20,
    background: theme.palette.background.default,
    border: `1px solid rgba(56, 56, 56, 1)`,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export default useStyles;

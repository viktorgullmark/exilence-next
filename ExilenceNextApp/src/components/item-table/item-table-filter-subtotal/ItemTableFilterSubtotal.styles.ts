import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  paper: {
    fontSize: '0.9rem',
    padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
    color: theme.palette.text.secondary,
    display: 'flex',
    borderRadius: 20,
    background: theme.palette.background.paper,
    border: `1px solid rgba(56, 56, 56, 1)`,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export default useStyles;

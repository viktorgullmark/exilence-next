import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
  noPadding: {
    padding: 0,
  },
  centered: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

export default useStyles;

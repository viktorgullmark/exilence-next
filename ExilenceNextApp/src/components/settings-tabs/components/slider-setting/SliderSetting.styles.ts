import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: 400,
    },
    input: {
      width: 42,
      marginRight: theme.spacing(2),
      height: 30.71,
    },
    label: {
      '& + .MuiInput-formControl': {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
      },
    },
    container: {
      display: 'flex',
      alignItems: 'center',
    },
    slider: {
      width: 120,
      marginRight: theme.spacing(2),
    },
    icon: {
      marginRight: theme.spacing(2),
    },
  })
);

export default useStyles;

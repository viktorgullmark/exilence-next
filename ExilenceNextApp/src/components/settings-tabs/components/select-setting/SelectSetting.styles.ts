import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) =>
  createStyles({
    label: {
      '& + .MuiInput-formControl': {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
      },
    },
    helperText: {
      marginLeft: 0,
    },
  })
);

export default useStyles;

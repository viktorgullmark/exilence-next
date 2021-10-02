import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) =>
  createStyles({
    checkBox: {
      marginTop: theme.spacing(0.75),
    },
    checkBoxValue: {
      color: theme.palette.text.primary,
    },
    helperText: {
      marginLeft: 0,
    },
  })
);

export default useStyles;

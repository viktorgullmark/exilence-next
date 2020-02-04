import { createStyles, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme =>
  createStyles({
    checkBox: {
      marginTop: theme.spacing(0.75)
    },
    checkBoxValue: {
      color: theme.palette.text.primary
    }
  })
);

export default useStyles;

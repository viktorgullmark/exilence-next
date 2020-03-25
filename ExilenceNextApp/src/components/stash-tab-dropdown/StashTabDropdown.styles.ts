import { createStyles, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme =>
  createStyles({
    formControl: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(3)
    },
    chip: {
      background: theme.palette.secondary.light
    },
  })
);

export default useStyles;

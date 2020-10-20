import { createStyles, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: 250,
    },
    input: {
      width: 42,
    },
    label: {
      '& + .MuiInput-formControl': {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
      },
    },
  })
);

export default useStyles;

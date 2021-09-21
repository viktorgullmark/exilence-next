import { createStyles, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) =>
  createStyles({
    label: {
      '& + .MuiInput-formControl': {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
      },
    },
    select: {
      maxWidth: 150,
    },
  })
);

export default useStyles;

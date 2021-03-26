import { createStyles, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
      '&::after': {
        content: 'min !important',
      },
    },
  })
);

export default useStyles;

import { createStyles, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme =>
  createStyles({
    chip: {
      background: theme.palette.secondary.light
    },
  })
);

export default useStyles;

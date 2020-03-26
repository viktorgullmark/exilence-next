import { createStyles, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme =>
  createStyles({
    chip: {
      background: theme.palette.secondary.light,
    },
    chipLabel: {
      textShadow: '-1px -1px 0 #303030, 1px -1px 0 #303030, -1px 1px 0 #303030, 1px 1px 0 #303030'
    }
  })
);

export default useStyles;

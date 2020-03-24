import { createStyles, makeStyles } from '@material-ui/core';

export const useStyles = makeStyles(theme =>
  createStyles({
    popper: {
      zIndex: 1000
    }
  })
);

export default useStyles;

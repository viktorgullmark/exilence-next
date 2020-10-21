import { createStyles, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) =>
  createStyles({
    chip: {
      background: theme.palette.secondary.light,
    },
    chipLabel: {},
  })
);

export default useStyles;

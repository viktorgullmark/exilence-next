import { Theme } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme: Theme) => ({
  iconButton: {
    padding: theme.spacing(0.5),
  },
  miscArea: {
    padding: `0 ${theme.spacing(1)}`,
  },
  badge: {
    backgroundColor: theme.palette.secondary.dark,
  },
}));

export default useStyles;

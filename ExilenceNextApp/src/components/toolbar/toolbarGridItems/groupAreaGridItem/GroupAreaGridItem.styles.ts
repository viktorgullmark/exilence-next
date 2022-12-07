import { Theme } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme: Theme) => ({
  iconButton: {
    padding: theme.spacing(0.5),
  },
  groupArea: {
    padding: `0 ${theme.spacing(1)}`,
  },
}));

export default useStyles;

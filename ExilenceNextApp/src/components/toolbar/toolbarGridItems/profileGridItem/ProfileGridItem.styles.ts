import { Theme } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme: Theme) => ({
  iconButton: {
    padding: theme.spacing(0.5),
  },
  profileArea: {
    padding: `0 ${theme.spacing(1)}`,
  },
  formControl: {
    padding: `0 ${theme.spacing(0.5)}`,
  },
  selectMenu: {
    fontSize: '0.9rem',
  },
}));

export default useStyles;

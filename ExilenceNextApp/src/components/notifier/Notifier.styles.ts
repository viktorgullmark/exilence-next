import makeStyles from '@mui/styles/makeStyles';

import { statusColors } from '../../assets/themes/exilence-theme';

const useStyles = makeStyles((theme) => ({
  error: {
    background: statusColors.error,
  },
  warning: {
    background: statusColors.warning,
  },
  info: {
    background: statusColors.info,
  },
  success: {
    background: statusColors.success,
  },
  default: {
    background: theme.palette.background.default,
    color: theme.palette.primary.contrastText,
  },
}));

export default useStyles;

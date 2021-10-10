import makeStyles from '@mui/styles/makeStyles';
import { statusColors } from '../../assets/themes/exilence-theme';

const useStyles = makeStyles((theme) => ({
  dialogActions: {
    padding: theme.spacing(2),
  },
  warningIcon: {
    color: statusColors.warning,
  },
}));

export default useStyles;

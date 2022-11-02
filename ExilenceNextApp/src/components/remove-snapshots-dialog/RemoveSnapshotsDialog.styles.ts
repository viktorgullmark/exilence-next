import makeStyles from '@mui/styles/makeStyles';
import { statusColors } from '../../assets/themes/exilence-theme';

const useStyles = makeStyles((theme) => ({
  dialogActions: {
    padding: theme.spacing(2),
  },
  warningIcon: {
    color: statusColors.warning,
  },
  // TODO: Any better solution?
  listItem: {
    maxWidth: '30rem',
    minWidth: '30rem',
  },
  emptyItem: {
    minWidth: '30rem',
  },
}));

export default useStyles;

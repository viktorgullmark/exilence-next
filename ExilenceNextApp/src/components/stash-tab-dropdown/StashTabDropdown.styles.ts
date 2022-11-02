import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { statusColors } from '../../assets/themes/exilence-theme';

const useStyles = makeStyles((theme) =>
  createStyles({
    chip: {
      background: theme.palette.secondary.main,
      margin: 4,
    },
    chipLabel: {},
    warningIcon: {
      color: statusColors.warning,
    },
  })
);

export default useStyles;

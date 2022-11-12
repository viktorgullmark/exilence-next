import makeStyles from '@mui/styles/makeStyles';

import { primaryLighter } from '../../../assets/themes/exilence-theme';

const useStyles = makeStyles((theme) => ({
  adornmentIcon: {
    marginLeft: theme.spacing(0.75),
    color: primaryLighter,
  },
}));

export default useStyles;

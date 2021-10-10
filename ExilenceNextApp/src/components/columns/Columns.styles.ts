import makeStyles from '@mui/styles/makeStyles';

import {
  currencyChangeColors,
  itemColors,
  primaryLighter,
} from '../../assets/themes/exilence-theme';

const useStyles = makeStyles((theme) => ({
  iconCellInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  tableCell: {
    padding: `${theme.spacing(1.75)} ${theme.spacing(2)}`,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  itemValue: {
    color: itemColors.chaosOrb,
  },
  iconCell: {
    padding: theme.spacing(0.75),
  },
  lastCell: {
    paddingRight: theme.spacing(1),
  },
  iconImg: {
    minHeight: 26,
    maxHeight: 26,
    maxWidth: 120,
  },
  unavailable: {
    color: theme.palette.text.disabled,
  },
  inlineIcon: {
    color: primaryLighter,
  },
  iconRoot: {
    fontSize: '1.2rem',
  },
  positiveChange: {
    fontWeight: 'bold',
    color: currencyChangeColors.positive,
  },
  negativeChange: {
    fontWeight: 'bold',
    color: currencyChangeColors.negative,
  },
  editIconRoot: {
    fontSize: '0.75rem',
  },
  ellipsis: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}));

export default useStyles;

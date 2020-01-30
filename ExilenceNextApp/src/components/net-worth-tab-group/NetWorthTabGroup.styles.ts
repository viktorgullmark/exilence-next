import { makeStyles } from '@material-ui/core';
import { primaryLighter } from '../../assets/themes/exilence-theme';

export const netWorthTabGroupHeight = 48;

const useStyles = makeStyles(theme => ({
  tabHeader: {
    height: netWorthTabGroupHeight,
    background: theme.palette.secondary.main
  },
  poeNinjaCredit: {
    height: netWorthTabGroupHeight,
    right: theme.spacing(2),
    color: theme.palette.text.primary
  },
  creditText: {
    fontSize: '0.85rem'
  },
  inlineLink: {
    color: primaryLighter,
    verticalAlign: 'baseline',
    textDecoration: 'none'
  },
  indicator: {
    backgroundColor: theme.palette.primary.light
  },
  tab: {
    // color: theme.palette.primary.light
  }
}));

export default useStyles;

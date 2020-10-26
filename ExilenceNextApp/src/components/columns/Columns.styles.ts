import { makeStyles } from '@material-ui/core';

import { primaryLighter } from '../../assets/themes/exilence-theme';

const useStyles = makeStyles((theme) => ({
  iconCellInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  tableCell: {
    padding: `${theme.spacing(1.75)}px ${theme.spacing(2)}px`,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
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
    color: theme.palette.text.hint,
  },
  inlineIcon: {
    color: primaryLighter,
  },
  iconRoot: {
    fontSize: '1.2rem',
  },
  editIconRoot: {
    fontSize: '0.75rem',
  },
}));

export default useStyles;

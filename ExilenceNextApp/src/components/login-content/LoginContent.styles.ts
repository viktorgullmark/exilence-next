import makeStyles from '@mui/styles/makeStyles';
import { primaryLighter } from '../../assets/themes/exilence-theme';

import { toolbarHeight } from '../header/Header';

const useStyles = makeStyles((theme) => ({
  content: {
    height: `calc(100% - ${toolbarHeight}px)`,
    flexGrow: 1,
  },
  loginContentContainer: {
    'box-shadow': '0px 0px 32px 1px rgba(0,0,0,0.77)',
    borderRadius: 0,
    padding: theme.spacing(5, 5),
  },
  linkBox: {
    background: theme.palette.background.default,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    position: 'relative',
  },
  infoWell: {
    marginBottom: theme.spacing(2),
  },
  copyIcon: {
    color: primaryLighter,
    position: 'absolute',
    right: 4,
    top: 4,
  },
  loginTitle: {
    marginTop: 0,
    textAlign: 'center',
    marginBottom: theme.spacing(3),
    textTransform: 'uppercase',
    paddingBottom: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.primary.main}`,
  },
  errorMessage: {
    color: theme.palette.error.main,
  },
  loginFooter: {
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'flex-end',
  },
  progressRight: {
    float: 'right',
  },
}));

export default useStyles;

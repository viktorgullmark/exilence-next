import { makeStyles } from '@material-ui/core';
import { toolbarHeight } from '../header/Header.styles';

const useStyles = makeStyles(theme => ({
  content: {
    height: `calc(100% - ${toolbarHeight}px)`,
    flexGrow: 1
  },
  loginContentContainer: {
    'box-shadow': '0px 0px 32px 1px rgba(0,0,0,0.77)',
    borderRadius: 0,
    padding: theme.spacing(5, 5)
  },
  loginTitle: {
    marginTop: 0,
    textAlign: 'center',
    marginBottom: theme.spacing(5),
    textTransform: 'uppercase',
    paddingBottom: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.primary.main}`
  },
  loginFooter: {
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'flex-end'
  },
  progressRight: {
    float: 'right'
  }
}));

export default useStyles;

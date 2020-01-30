import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  helperIcon: {
    color: theme.palette.primary.light,
    marginRight: theme.spacing(-0.5)
  },
  inlineLink: {
    color: theme.palette.primary.light,
    verticalAlign: 'baseline'
  }
}));

export default useStyles;

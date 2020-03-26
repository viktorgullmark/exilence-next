import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  searchField: {
    width: '100%',
    marginTop: theme.spacing(0.5),
  },
  clearIcon: {
    marginRight: theme.spacing(-0.5)
  },
}));

export default useStyles;

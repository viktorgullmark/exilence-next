import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  helperIcon: {
    color: theme.palette.primary.light,
    marginRight: theme.spacing(-0.5),
  },
  inlineLink: {
    color: theme.palette.primary.light,
    verticalAlign: 'baseline',
  },
  modalBody: {
    color: theme.palette.text.hint,
  },
  linkBlock: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}));

export default useStyles;
